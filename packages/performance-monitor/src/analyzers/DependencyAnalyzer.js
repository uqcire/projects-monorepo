import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'

import chalk from 'chalk'
import { glob } from 'glob'

import { MetricsCollector } from '../utils/MetricsCollector.js'

export class DependencyAnalyzer {
  constructor(projectPath = '.') {
    this.projectPath = resolve(projectPath)
    this.metrics = new MetricsCollector()
  }

  async analyze() {
    console.log(chalk.blue('🔍 开始分析依赖...'))

    const results = {
      projectPath: this.projectPath,
      timestamp: new Date().toISOString(),
      analysis: {},
      summary: {},
      recommendations: [],
    }

    // 分析workspace依赖
    if (await this.isWorkspace()) {
      results.analysis = await this.analyzeWorkspace()
    }
    else {
      results.analysis = await this.analyzeSingleProject()
    }

    // 生成总结
    results.summary = this.generateSummary(results.analysis)

    // 生成优化建议
    results.recommendations = this.generateRecommendations(results.analysis)

    console.log(chalk.green('✅ 依赖分析完成'))
    return results
  }

  async isWorkspace() {
    const workspaceFile = join(this.projectPath, 'pnpm-workspace.yaml')
    const lernaBJsonFile = join(this.projectPath, 'lerna.json')
    const packageJson = join(this.projectPath, 'package.json')

    if (existsSync(workspaceFile) || existsSync(lernaBJsonFile)) {
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

  async analyzeWorkspace() {
    const analysis = {
      type: 'workspace',
      projects: [],
      globalDependencies: {},
      duplicates: [],
      versionConflicts: [],
      healthScore: 0,
    }

    // 查找所有项目
    const packageJsonFiles = await glob('**/package.json', {
      cwd: this.projectPath,
      ignore: ['**/node_modules/**'],
    })

    for (const pkgFile of packageJsonFiles) {
      const pkgPath = join(this.projectPath, pkgFile)
      const projectAnalysis = await this.analyzePackageJson(pkgPath)
      if (projectAnalysis) {
        analysis.projects.push(projectAnalysis)
      }
    }

    // 分析重复依赖
    analysis.duplicates = this.findDuplicateDependencies(analysis.projects)

    // 分析版本冲突
    analysis.versionConflicts = this.findVersionConflicts(analysis.projects)

    // 收集全局依赖统计
    analysis.globalDependencies = this.collectGlobalDependencies(analysis.projects)

    // 计算健康度评分
    analysis.healthScore = this.calculateHealthScore(analysis)

    return analysis
  }

  async analyzeSingleProject() {
    const packageJsonPath = join(this.projectPath, 'package.json')
    const projectAnalysis = await this.analyzePackageJson(packageJsonPath)

    return {
      type: 'single',
      project: projectAnalysis,
      healthScore: projectAnalysis ? this.calculateProjectHealthScore(projectAnalysis) : 0,
    }
  }

  async analyzePackageJson(packageJsonPath) {
    if (!existsSync(packageJsonPath)) {
      return null
    }

    try {
      const content = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      const projectDir = resolve(packageJsonPath, '..')

      return {
        name: content.name || 'unknown',
        path: packageJsonPath,
        version: content.version || '0.0.0',
        dependencies: content.dependencies || {},
        devDependencies: content.devDependencies || {},
        peerDependencies: content.peerDependencies || {},
        dependencyCount: {
          dependencies: Object.keys(content.dependencies || {}).length,
          devDependencies: Object.keys(content.devDependencies || {}).length,
          peerDependencies: Object.keys(content.peerDependencies || {}).length,
        },
        scripts: content.scripts || {},
        nodeModulesExists: existsSync(join(projectDir, 'node_modules')),
        lockFileExists: this.checkLockFile(projectDir),
      }
    }
    catch {
      return null
    }
  }

  checkLockFile(projectDir) {
    return existsSync(join(projectDir, 'package-lock.json'))
      || existsSync(join(projectDir, 'yarn.lock'))
      || existsSync(join(projectDir, 'pnpm-lock.yaml'))
  }

  findDuplicateDependencies(projects) {
    const dependencyMap = new Map()
    const duplicates = []

    for (const project of projects) {
      const allDeps = {
        ...project.dependencies,
        ...project.devDependencies,
      }

      for (const [depName, version] of Object.entries(allDeps)) {
        if (!dependencyMap.has(depName)) {
          dependencyMap.set(depName, [])
        }
        dependencyMap.get(depName).push({
          project: project.name,
          version,
          type: project.dependencies[depName] ? 'dependency' : 'devDependency',
        })
      }
    }

    for (const [depName, usages] of dependencyMap.entries()) {
      if (usages.length > 1) {
        const versions = [...new Set(usages.map(u => u.version))]
        duplicates.push({
          dependency: depName,
          usageCount: usages.length,
          versions,
          hasVersionConflict: versions.length > 1,
          usages,
        })
      }
    }

    return duplicates.sort((a, b) => b.usageCount - a.usageCount)
  }

  findVersionConflicts(projects) {
    const conflicts = []
    const dependencyVersions = new Map()

    for (const project of projects) {
      const allDeps = {
        ...project.dependencies,
        ...project.devDependencies,
      }

      for (const [depName, version] of Object.entries(allDeps)) {
        if (!dependencyVersions.has(depName)) {
          dependencyVersions.set(depName, new Set())
        }
        dependencyVersions.get(depName).add(version)
      }
    }

    for (const [depName, versions] of dependencyVersions.entries()) {
      if (versions.size > 1) {
        conflicts.push({
          dependency: depName,
          versions: Array.from(versions),
          severity: this.assessConflictSeverity(Array.from(versions)),
        })
      }
    }

    return conflicts.sort((a, b) => this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity))
  }

  assessConflictSeverity(versions) {
    // 简单的版本冲突严重性评估
    const majorVersions = versions.map((v) => {
      const match = v.match(/^[\^~]?(\d+)/)
      return match ? Number.parseInt(match[1]) : 0
    })

    const uniqueMajorVersions = [...new Set(majorVersions)]

    if (uniqueMajorVersions.length > 1) {
      return 'high' // 主版本号不同
    }
    else if (versions.some(v => v.includes('^')) && versions.some(v => v.includes('~'))) {
      return 'medium' // 版本范围冲突
    }
    else {
      return 'low' // 次要版本差异
    }
  }

  getSeverityWeight(severity) {
    const weights = { high: 3, medium: 2, low: 1 }
    return weights[severity] || 0
  }

  collectGlobalDependencies(projects) {
    const globalDeps = {}

    for (const project of projects) {
      const allDeps = {
        ...project.dependencies,
        ...project.devDependencies,
      }

      for (const [depName, version] of Object.entries(allDeps)) {
        if (!globalDeps[depName]) {
          globalDeps[depName] = {
            versions: new Set(),
            projects: new Set(),
            type: new Set(),
          }
        }

        globalDeps[depName].versions.add(version)
        globalDeps[depName].projects.add(project.name)
        globalDeps[depName].type.add(project.dependencies[depName] ? 'dependency' : 'devDependency')
      }
    }

    // 转换Set为Array以便序列化
    const result = {}
    for (const [depName, info] of Object.entries(globalDeps)) {
      result[depName] = {
        versions: Array.from(info.versions),
        projects: Array.from(info.projects),
        types: Array.from(info.type),
        usageCount: info.projects.size,
      }
    }

    return result
  }

  calculateHealthScore(analysis) {
    let score = 100

    // 减分项
    score -= Math.min(analysis.duplicates.length * 2, 30) // 重复依赖
    score -= Math.min(analysis.versionConflicts.length * 5, 40) // 版本冲突

    // 高危版本冲突额外减分
    const highSeverityConflicts = analysis.versionConflicts.filter(c => c.severity === 'high')
    score -= highSeverityConflicts.length * 10

    // 项目缺少锁文件减分
    const projectsWithoutLock = analysis.projects.filter(p => !p.lockFileExists)
    score -= Math.min(projectsWithoutLock.length * 5, 20)

    return Math.max(score, 0)
  }

  calculateProjectHealthScore(project) {
    let score = 100

    // 基础检查
    if (!project.lockFileExists)
      score -= 20
    if (!project.nodeModulesExists)
      score -= 10

    // 依赖数量合理性
    const totalDeps = project.dependencyCount.dependencies + project.dependencyCount.devDependencies
    if (totalDeps > 100)
      score -= 15
    if (totalDeps > 200)
      score -= 25

    return Math.max(score, 0)
  }

  generateSummary(analysis) {
    if (analysis.type === 'workspace') {
      return {
        type: 'workspace',
        totalProjects: analysis.projects.length,
        totalDependencies: Object.keys(analysis.globalDependencies).length,
        duplicateDependencies: analysis.duplicates.length,
        versionConflicts: analysis.versionConflicts.length,
        healthScore: analysis.healthScore,
        topDuplicates: analysis.duplicates.slice(0, 5).map(d => ({
          name: d.dependency,
          usageCount: d.usageCount,
          hasConflict: d.hasVersionConflict,
        })),
      }
    }
    else {
      return {
        type: 'single',
        projectName: analysis.project?.name || 'unknown',
        dependencies: analysis.project?.dependencyCount.dependencies || 0,
        devDependencies: analysis.project?.dependencyCount.devDependencies || 0,
        healthScore: analysis.healthScore,
        hasLockFile: analysis.project?.lockFileExists || false,
      }
    }
  }

  generateRecommendations(analysis) {
    const recommendations = []

    if (analysis.type === 'workspace') {
      // 版本冲突建议
      if (analysis.versionConflicts.length > 0) {
        const highSeverityConflicts = analysis.versionConflicts.filter(c => c.severity === 'high')
        if (highSeverityConflicts.length > 0) {
          recommendations.push({
            type: 'version-conflicts',
            priority: 'high',
            message: `发现 ${highSeverityConflicts.length} 个高危版本冲突，建议统一版本号`,
            details: highSeverityConflicts.slice(0, 3).map(c => c.dependency),
          })
        }
      }

      // 重复依赖建议
      if (analysis.duplicates.length > 10) {
        recommendations.push({
          type: 'duplicates',
          priority: 'medium',
          message: `发现 ${analysis.duplicates.length} 个重复依赖，建议提升到 workspace 根目录`,
          details: analysis.duplicates.slice(0, 5).map(d => d.dependency),
        })
      }

      // 锁文件建议
      const projectsWithoutLock = analysis.projects.filter(p => !p.lockFileExists)
      if (projectsWithoutLock.length > 0) {
        recommendations.push({
          type: 'lock-files',
          priority: 'medium',
          message: `${projectsWithoutLock.length} 个项目缺少锁文件，建议添加`,
          details: projectsWithoutLock.map(p => p.name),
        })
      }
    }
    else {
      // 单项目建议
      if (analysis.project) {
        if (!analysis.project.lockFileExists) {
          recommendations.push({
            type: 'lock-file',
            priority: 'high',
            message: '缺少锁文件，建议运行 npm install 或 pnpm install 生成',
          })
        }

        const totalDeps = analysis.project.dependencyCount.dependencies + analysis.project.dependencyCount.devDependencies
        if (totalDeps > 100) {
          recommendations.push({
            type: 'dependency-count',
            priority: 'medium',
            message: `依赖数量较多 (${totalDeps})，建议审查并移除不必要的依赖`,
          })
        }
      }
    }

    return recommendations
  }
}

// 仅在直接运行时执行
if (process.argv[1] && process.argv[1].includes('DependencyAnalyzer.js')) {
  const analyzer = new DependencyAnalyzer()
  analyzer.analyze().then((results) => {
    console.log('依赖分析结果:')
    console.log(JSON.stringify(results, null, 2))
  }).catch((error) => {
    console.error('分析失败:', error)
    process.exit(1)
  })
}
