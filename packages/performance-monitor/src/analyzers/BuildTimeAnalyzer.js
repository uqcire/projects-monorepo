import { exec } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'

import chalk from 'chalk'
import { glob } from 'glob'

import { MetricsCollector } from '../utils/MetricsCollector.js'

const execAsync = promisify(exec)

export class BuildTimeAnalyzer {
  constructor(projectPath = '.') {
    this.projectPath = resolve(projectPath)
    this.metrics = new MetricsCollector()
  }

  async analyze() {
    console.log(chalk.blue('🔍 开始分析构建时间...'))

    const results = {
      projectPath: this.projectPath,
      timestamp: new Date().toISOString(),
      analysis: {},
      summary: {},
      recommendations: [],
    }

    // 检查是否为workspace
    if (await this.isWorkspace()) {
      results.analysis = await this.analyzeWorkspaceBuildTime()
    }
    else {
      results.analysis = await this.analyzeSingleProjectBuildTime()
    }

    // 生成总结
    results.summary = this.generateSummary(results.analysis)

    // 生成优化建议
    results.recommendations = this.generateRecommendations(results.analysis)

    console.log(chalk.green('✅ 构建时间分析完成'))
    return results
  }

  async isWorkspace() {
    const workspaceFile = join(this.projectPath, 'pnpm-workspace.yaml')
    const packageJson = join(this.projectPath, 'package.json')

    if (existsSync(workspaceFile)) {
      return true
    }

    if (existsSync(packageJson)) {
      try {
        const content = JSON.parse(readFileSync(packageJson, 'utf-8'))
        return !!(content.workspaces)
      }
      catch {
        return false
      }
    }

    return false
  }

  async analyzeWorkspaceBuildTime() {
    const analysis = {
      type: 'workspace',
      projects: [],
      parallelBuildTime: 0,
      serialBuildTime: 0,
      efficiency: 0,
      bottlenecks: [],
    }

    // 查找所有有构建脚本的项目
    const packageJsonFiles = await glob('**/package.json', {
      cwd: this.projectPath,
      ignore: ['**/node_modules/**'],
    })

    const buildableProjects = []

    for (const pkgFile of packageJsonFiles) {
      const pkgPath = join(this.projectPath, pkgFile)
      const projectInfo = await this.getProjectBuildInfo(pkgPath)
      if (projectInfo && projectInfo.hasBuildScript) {
        buildableProjects.push(projectInfo)
      }
    }

    // 测量串行构建时间
    if (buildableProjects.length > 0) {
      analysis.serialBuildTime = await this.measureSerialBuildTime(buildableProjects)
      analysis.parallelBuildTime = await this.measureParallelBuildTime(buildableProjects)
      analysis.projects = await this.measureIndividualBuildTimes(buildableProjects)

      // 计算效率
      if (analysis.serialBuildTime > 0) {
        analysis.efficiency = Math.round((analysis.serialBuildTime / analysis.parallelBuildTime) * 100) / 100
      }

      // 识别瓶颈
      analysis.bottlenecks = this.identifyBottlenecks(analysis.projects)
    }

    return analysis
  }

  async analyzeSingleProjectBuildTime() {
    const packageJsonPath = join(this.projectPath, 'package.json')
    const projectInfo = await this.getProjectBuildInfo(packageJsonPath)

    if (!projectInfo || !projectInfo.hasBuildScript) {
      return {
        type: 'single',
        hasBuildScript: false,
        message: '项目没有构建脚本',
      }
    }

    const buildTime = await this.measureProjectBuildTime(this.projectPath, projectInfo.buildScript)
    const sourceAnalysis = await this.analyzeSourceFiles(this.projectPath)

    return {
      type: 'single',
      hasBuildScript: true,
      buildTime,
      sourceAnalysis,
      projectInfo,
    }
  }

  async getProjectBuildInfo(packageJsonPath) {
    if (!existsSync(packageJsonPath)) {
      return null
    }

    try {
      const content = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      const projectDir = resolve(packageJsonPath, '..')
      const scripts = content.scripts || {}

      return {
        name: content.name || 'unknown',
        path: projectDir,
        packageJsonPath,
        scripts,
        hasBuildScript: !!(scripts.build || scripts['build:prod'] || scripts.compile),
        buildScript: scripts.build || scripts['build:prod'] || scripts.compile,
        hasDevScript: !!(scripts.dev || scripts.serve || scripts.start),
        devScript: scripts.dev || scripts.serve || scripts.start,
      }
    }
    catch {
      return null
    }
  }

  async measureSerialBuildTime(projects) {
    console.log(chalk.yellow('测量串行构建时间...'))
    const startTime = Date.now()

    for (const project of projects) {
      try {
        await this.runBuildCommand(project.path, project.buildScript)
      }
      catch (error) {
        console.log(chalk.red(`项目 ${project.name} 构建失败: ${error.message}`))
      }
    }

    return Date.now() - startTime
  }

  async measureParallelBuildTime(projects) {
    console.log(chalk.yellow('测量并行构建时间...'))
    const startTime = Date.now()

    const buildPromises = projects.map(project =>
      this.runBuildCommand(project.path, project.buildScript).catch((error) => {
        console.log(chalk.red(`项目 ${project.name} 构建失败: ${error.message}`))
        return { error: error.message }
      }),
    )

    await Promise.all(buildPromises)
    return Date.now() - startTime
  }

  async measureIndividualBuildTimes(projects) {
    console.log(chalk.yellow('测量各项目构建时间...'))
    const results = []

    for (const project of projects) {
      const buildTime = await this.measureProjectBuildTime(project.path, project.buildScript)
      const sourceAnalysis = await this.analyzeSourceFiles(project.path)

      results.push({
        name: project.name,
        path: project.path,
        buildTime,
        sourceAnalysis,
        buildScript: project.buildScript,
      })
    }

    return results.sort((a, b) => b.buildTime - a.buildTime)
  }

  async measureProjectBuildTime(projectPath, buildScript) {
    const startTime = Date.now()

    try {
      await this.runBuildCommand(projectPath, buildScript)
      return Date.now() - startTime
    }
    catch (error) {
      console.log(chalk.red(`构建失败: ${error.message}`))
      return -1 // 构建失败
    }
  }

  async runBuildCommand(projectPath, buildScript) {
    // 首先尝试清理之前的构建
    try {
      await execAsync('rm -rf dist build', { cwd: projectPath })
    }
    catch {
      // 忽略清理错误
    }

    // 运行构建命令
    const command = `npm run ${buildScript.split(' ')[0]}`
    const { stdout, stderr } = await execAsync(command, {
      cwd: projectPath,
      timeout: 300000, // 5分钟超时
    })

    return { stdout, stderr }
  }

  async analyzeSourceFiles(projectPath) {
    const srcPath = join(projectPath, 'src')
    if (!existsSync(srcPath)) {
      return {
        totalFiles: 0,
        totalLines: 0,
        fileTypes: {},
      }
    }

    const files = await glob('**/*', { cwd: srcPath, nodir: true })
    const analysis = {
      totalFiles: files.length,
      totalLines: 0,
      fileTypes: {},
    }

    for (const file of files) {
      const filePath = join(srcPath, file)
      const ext = file.split('.').pop()?.toLowerCase() || 'unknown'

      if (!analysis.fileTypes[ext]) {
        analysis.fileTypes[ext] = { count: 0, lines: 0 }
      }

      analysis.fileTypes[ext].count++

      try {
        if (['.js', '.ts', '.vue', '.jsx', '.tsx', '.css', '.scss', '.less'].includes(`.${ext}`)) {
          const content = readFileSync(filePath, 'utf-8')
          const lines = content.split('\n').length
          analysis.totalLines += lines
          analysis.fileTypes[ext].lines += lines
        }
      }
      catch {
        // 忽略读取错误
      }
    }

    return analysis
  }

  identifyBottlenecks(projects) {
    const bottlenecks = []
    const avgBuildTime = projects.reduce((sum, p) => sum + p.buildTime, 0) / projects.length

    for (const project of projects) {
      if (project.buildTime > avgBuildTime * 1.5) {
        bottlenecks.push({
          project: project.name,
          buildTime: project.buildTime,
          slowdownFactor: Math.round((project.buildTime / avgBuildTime) * 100) / 100,
          reason: this.analyzeSlowdownReason(project),
        })
      }
    }

    return bottlenecks.sort((a, b) => b.slowdownFactor - a.slowdownFactor)
  }

  analyzeSlowdownReason(project) {
    const reasons = []

    if (project.sourceAnalysis.totalFiles > 100) {
      reasons.push('文件数量较多')
    }

    if (project.sourceAnalysis.totalLines > 10000) {
      reasons.push('代码行数较多')
    }

    const tsFiles = project.sourceAnalysis.fileTypes.ts || { count: 0 }
    const jsFiles = project.sourceAnalysis.fileTypes.js || { count: 0 }

    if (tsFiles.count > jsFiles.count * 2) {
      reasons.push('TypeScript编译耗时')
    }

    return reasons.length > 0 ? reasons.join(', ') : '未知原因'
  }

  generateSummary(analysis) {
    if (analysis.type === 'workspace') {
      return {
        type: 'workspace',
        totalProjects: analysis.projects.length,
        serialBuildTime: this.formatTime(analysis.serialBuildTime),
        parallelBuildTime: this.formatTime(analysis.parallelBuildTime),
        efficiency: analysis.efficiency,
        timeSaved: this.formatTime(analysis.serialBuildTime - analysis.parallelBuildTime),
        bottleneckCount: analysis.bottlenecks.length,
        slowestProject: analysis.projects.length > 0
          ? {
              name: analysis.projects[0].name,
              buildTime: this.formatTime(analysis.projects[0].buildTime),
            }
          : null,
      }
    }
    else {
      return {
        type: 'single',
        hasBuildScript: analysis.hasBuildScript,
        buildTime: analysis.buildTime ? this.formatTime(analysis.buildTime) : 'N/A',
        totalFiles: analysis.sourceAnalysis?.totalFiles || 0,
        totalLines: analysis.sourceAnalysis?.totalLines || 0,
      }
    }
  }

  generateRecommendations(analysis) {
    const recommendations = []

    if (analysis.type === 'workspace') {
      // 并行构建效率建议
      if (analysis.efficiency < 2 && analysis.projects.length > 1) {
        recommendations.push({
          type: 'parallel-build',
          priority: 'high',
          message: `并行构建效率较低 (${analysis.efficiency}x)，建议优化依赖关系和构建脚本`,
        })
      }

      // 瓶颈项目建议
      if (analysis.bottlenecks.length > 0) {
        const topBottleneck = analysis.bottlenecks[0]
        recommendations.push({
          type: 'bottleneck',
          priority: 'high',
          message: `项目 ${topBottleneck.project} 构建时间过长 (${topBottleneck.slowdownFactor}x)，${topBottleneck.reason}`,
        })
      }

      // 构建时间过长建议
      if (analysis.parallelBuildTime > 120000) { // 大于2分钟
        recommendations.push({
          type: 'build-time',
          priority: 'medium',
          message: `整体构建时间较长 (${this.formatTime(analysis.parallelBuildTime)})，建议启用增量构建`,
        })
      }
    }
    else {
      if (analysis.hasBuildScript && analysis.buildTime > 60000) { // 大于1分钟
        recommendations.push({
          type: 'build-time',
          priority: 'medium',
          message: `构建时间较长 (${this.formatTime(analysis.buildTime)})，建议优化构建配置`,
        })
      }

      if (analysis.sourceAnalysis?.totalFiles > 200) {
        recommendations.push({
          type: 'file-count',
          priority: 'low',
          message: `项目文件数量较多 (${analysis.sourceAnalysis.totalFiles})，可能影响构建性能`,
        })
      }
    }

    return recommendations
  }

  formatTime(milliseconds) {
    if (milliseconds < 0)
      return '构建失败'
    if (milliseconds < 1000)
      return `${milliseconds}ms`
    if (milliseconds < 60000)
      return `${Math.round(milliseconds / 100) / 10}s`
    return `${Math.round(milliseconds / 6000) / 10}min`
  }
}
