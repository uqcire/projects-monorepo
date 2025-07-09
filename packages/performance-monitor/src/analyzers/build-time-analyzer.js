import { spawn } from 'node:child_process'
import { MetricsCollector } from '../utils/metrics-collector.js'

/**
 * 构建时间分析器 - 分析项目的构建时间和性能瓶颈
 */
export class BuildTimeAnalyzer {
  constructor(options = {}) {
    this.options = {
      command: 'pnpm',
      buildScript: 'build',
      maxConcurrency: 5,
      timeout: 300000, // 5分钟超时
      ...options,
    }
    this.collector = new MetricsCollector()
  }

  /**
   * 分析指定项目的构建时间
   * @param {string} projectPath - 项目路径
   * @returns {object} 分析结果
   */
  async analyze(projectPath = '.') {
    this.collector.startTimer('build-time-analysis')

    try {
      const results = {
        projectPath,
        timestamp: new Date().toISOString(),
        summary: {},
        buildResults: [],
        performance: {},
        recommendations: [],
      }

      // 分析单个构建性能
      const singleBuildResult = await this.measureSingleBuild(projectPath)
      results.buildResults.push(singleBuildResult)

      // 分析并行构建性能
      const parallelBuildResult = await this.measureParallelBuild(projectPath)
      results.buildResults.push(parallelBuildResult)

      // 生成性能摘要
      results.summary = this.generateSummary(results.buildResults)
      results.performance = this.analyzePerformance(results.buildResults)

      // 生成优化建议
      results.recommendations = this.generateRecommendations(results)

      const analysisTime = this.collector.endTimer('build-time-analysis')
      results.analysisTime = `${analysisTime.toFixed(2)}ms`

      return results
    }
    catch (error) {
      this.collector.endTimer('build-time-analysis')
      throw new Error(`Build time analysis failed: ${error.message}`)
    }
  }

  /**
   * 测量单个项目构建时间
   * @param {string} projectPath - 项目路径
   * @returns {object} 构建结果
   */
  async measureSingleBuild(projectPath) {
    this.collector.startTimer('single-build')

    const result = {
      type: 'sequential',
      startTime: new Date().toISOString(),
      projects: [],
      totalTime: 0,
      success: true,
      errors: [],
    }

    try {
      // 运行构建命令
      const buildOutput = await this.runBuildCommand(projectPath, 'build:sequential')
      result.output = buildOutput.stdout
      result.errors = buildOutput.stderr ? [buildOutput.stderr] : []

      result.totalTime = this.collector.endTimer('single-build')
      result.endTime = new Date().toISOString()

      // 解析构建输出获取项目信息
      result.projects = this.parseBuildOutput(buildOutput.stdout)
    }
    catch (error) {
      result.success = false
      result.errors.push(error.message)
      result.totalTime = this.collector.endTimer('single-build')
    }

    return result
  }

  /**
   * 测量并行构建时间
   * @param {string} projectPath - 项目路径
   * @returns {object} 构建结果
   */
  async measureParallelBuild(projectPath) {
    this.collector.startTimer('parallel-build')

    const result = {
      type: 'parallel',
      startTime: new Date().toISOString(),
      projects: [],
      totalTime: 0,
      success: true,
      errors: [],
    }

    try {
      // 运行并行构建命令
      const buildOutput = await this.runBuildCommand(projectPath, 'build:parallel')
      result.output = buildOutput.stdout
      result.errors = buildOutput.stderr ? [buildOutput.stderr] : []

      result.totalTime = this.collector.endTimer('parallel-build')
      result.endTime = new Date().toISOString()

      // 解析构建输出获取项目信息
      result.projects = this.parseBuildOutput(buildOutput.stdout)
    }
    catch (error) {
      result.success = false
      result.errors.push(error.message)
      result.totalTime = this.collector.endTimer('parallel-build')
    }

    return result
  }

  /**
   * 运行构建命令
   * @param {string} projectPath - 项目路径
   * @param {string} script - 构建脚本名称
   * @returns {Promise<object>} 命令执行结果
   */
  runBuildCommand(projectPath, script) {
    return new Promise((resolve, reject) => {
      const child = spawn(this.options.command, ['run', script], {
        cwd: projectPath,
        stdio: 'pipe',
        shell: true,
      })

      let stdout = ''
      let stderr = ''

      child.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      child.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, code })
        }
        else {
          reject(new Error(`Build failed with code ${code}: ${stderr}`))
        }
      })

      child.on('error', (error) => {
        reject(error)
      })

      // 设置超时
      setTimeout(() => {
        child.kill()
        reject(new Error('Build timeout'))
      }, this.options.timeout)
    })
  }

  /**
   * 解析构建输出获取项目信息
   * @param {string} output - 构建输出
   * @returns {Array} 项目构建信息
   */
  parseBuildOutput(output) {
    const projects = []
    const lines = output.split('\n')

    // 简化的输出解析 - 实际项目中可能需要更复杂的解析逻辑
    let currentProject = null

    for (const line of lines) {
      // 检测项目开始
      if (line.includes('Building') || line.includes('building')) {
        const match = line.match(/(?:Building|building)\s+(.+?)(?:\s|$)/i)
        if (match) {
          currentProject = {
            name: match[1].trim(),
            startTime: new Date().toISOString(),
            buildTime: 0,
            success: true,
            warnings: [],
            errors: [],
          }
        }
      }

      // 检测构建完成
      if (line.includes('built in') || line.includes('Built in')) {
        const timeMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:ms|s)/)
        if (timeMatch && currentProject) {
          const time = Number.parseFloat(timeMatch[1])
          currentProject.buildTime = timeMatch[0].includes('s') && !timeMatch[0].includes('ms') ? time * 1000 : time
          currentProject.endTime = new Date().toISOString()
          projects.push(currentProject)
          currentProject = null
        }
      }

      // 检测警告和错误
      if (currentProject) {
        if (line.includes('warning') || line.includes('Warning')) {
          currentProject.warnings.push(line.trim())
        }
        if (line.includes('error') || line.includes('Error')) {
          currentProject.errors.push(line.trim())
          currentProject.success = false
        }
      }
    }

    return projects
  }

  /**
   * 生成分析摘要
   * @param {Array} buildResults - 构建结果列表
   * @returns {object} 摘要信息
   */
  generateSummary(buildResults) {
    const summary = {
      totalBuilds: buildResults.length,
      successfulBuilds: buildResults.filter(r => r.success).length,
      failedBuilds: buildResults.filter(r => !r.success).length,
    }

    // 计算最快和最慢的构建
    const validResults = buildResults.filter(r => r.success && r.totalTime > 0)

    if (validResults.length > 0) {
      const times = validResults.map(r => r.totalTime)
      summary.fastestBuild = {
        type: validResults[times.indexOf(Math.min(...times))].type,
        time: Math.min(...times),
        humanTime: this.formatTime(Math.min(...times)),
      }

      summary.slowestBuild = {
        type: validResults[times.indexOf(Math.max(...times))].type,
        time: Math.max(...times),
        humanTime: this.formatTime(Math.max(...times)),
      }

      summary.averageBuildTime = {
        time: times.reduce((a, b) => a + b, 0) / times.length,
        humanTime: this.formatTime(times.reduce((a, b) => a + b, 0) / times.length),
      }
    }

    return summary
  }

  /**
   * 分析性能数据
   * @param {Array} buildResults - 构建结果列表
   * @returns {object} 性能分析
   */
  analyzePerformance(buildResults) {
    const performance = {
      parallelEfficiency: 0,
      bottlenecks: [],
      optimizationPotential: 0,
    }

    const sequentialResult = buildResults.find(r => r.type === 'sequential' && r.success)
    const parallelResult = buildResults.find(r => r.type === 'parallel' && r.success)

    if (sequentialResult && parallelResult) {
      // 计算并行效率
      performance.parallelEfficiency = (
        (sequentialResult.totalTime - parallelResult.totalTime) / sequentialResult.totalTime * 100
      ).toFixed(1)

      // 分析瓶颈项目
      if (parallelResult.projects.length > 0) {
        const sortedProjects = parallelResult.projects
          .filter(p => p.buildTime > 0)
          .sort((a, b) => b.buildTime - a.buildTime)

        performance.bottlenecks = sortedProjects.slice(0, 3).map(project => ({
          name: project.name,
          buildTime: project.buildTime,
          humanTime: this.formatTime(project.buildTime),
          percentage: ((project.buildTime / parallelResult.totalTime) * 100).toFixed(1),
        }))
      }

      // 估算优化潜力
      performance.optimizationPotential = Math.max(0, 100 - Number.parseFloat(performance.parallelEfficiency),
      ).toFixed(1)
    }

    return performance
  }

  /**
   * 生成优化建议
   * @param {object} results - 分析结果
   * @returns {Array} 优化建议列表
   */
  generateRecommendations(results) {
    const recommendations = []
    const { summary, performance } = results

    // 构建失败建议
    if (summary.failedBuilds > 0) {
      recommendations.push({
        type: 'build-failures',
        priority: 'high',
        message: `有 ${summary.failedBuilds} 个构建失败`,
        suggestions: [
          '检查构建日志中的错误信息',
          '确保所有依赖都已正确安装',
          '检查TypeScript类型错误',
          '验证环境变量配置',
        ],
      })
    }

    // 并行效率建议
    if (performance.parallelEfficiency && Number.parseFloat(performance.parallelEfficiency) < 30) {
      recommendations.push({
        type: 'parallel-efficiency',
        priority: 'medium',
        message: `并行构建效率只有 ${performance.parallelEfficiency}%，可以进一步优化`,
        suggestions: [
          '增加并行构建的并发数',
          '优化依赖关系减少构建阻塞',
          '考虑使用增量构建',
          '启用构建缓存',
        ],
      })
    }

    // 构建时间建议
    if (summary.averageBuildTime && summary.averageBuildTime.time > 180000) { // 3分钟
      recommendations.push({
        type: 'build-time',
        priority: 'medium',
        message: `平均构建时间 ${summary.averageBuildTime.humanTime} 较长`,
        suggestions: [
          '启用Vite的构建缓存',
          '使用SWC替代Babel进行转译',
          '优化Webpack配置',
          '考虑使用Turbo等构建加速工具',
        ],
      })
    }

    // 瓶颈项目建议
    if (performance.bottlenecks && performance.bottlenecks.length > 0) {
      const slowestProject = performance.bottlenecks[0]
      recommendations.push({
        type: 'build-bottleneck',
        priority: 'medium',
        message: `项目 ${slowestProject.name} 是构建瓶颈，耗时 ${slowestProject.humanTime}`,
        bottleneck: slowestProject,
        suggestions: [
          '分析该项目的构建配置',
          '检查是否有大型资源文件',
          '优化代码分割策略',
          '考虑将大型项目拆分',
        ],
      })
    }

    return recommendations
  }

  /**
   * 格式化时间显示
   * @param {number} milliseconds - 毫秒数
   * @returns {string} 格式化的时间字符串
   */
  formatTime(milliseconds) {
    if (milliseconds < 1000) {
      return `${milliseconds.toFixed(0)}ms`
    }
    else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(1)}s`
    }
    else {
      const minutes = Math.floor(milliseconds / 60000)
      const seconds = ((milliseconds % 60000) / 1000).toFixed(0)
      return `${minutes}m ${seconds}s`
    }
  }
}
