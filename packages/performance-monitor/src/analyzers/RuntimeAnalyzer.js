import { existsSync } from 'node:fs'
import os from 'node:os'
import { resolve } from 'node:path'
import process from 'node:process'

import chalk from 'chalk'

import { MetricsCollector } from '../utils/MetricsCollector.js'

export class RuntimeAnalyzer {
  constructor(projectPath = '.') {
    this.projectPath = resolve(projectPath)
    this.metrics = new MetricsCollector()
  }

  async analyze() {
    console.log(chalk.blue('🔍 开始分析运行时性能...'))

    const results = {
      projectPath: this.projectPath,
      timestamp: new Date().toISOString(),
      analysis: {},
      summary: {},
      recommendations: [],
    }

    // 收集系统指标
    results.analysis.systemMetrics = await this.collectSystemMetrics()

    // 分析内存使用
    results.analysis.memoryUsage = this.analyzeMemoryUsage()

    // 检查性能配置
    results.analysis.performanceConfig = await this.checkPerformanceConfiguration()

    // 生成总结
    results.summary = this.generateSummary(results.analysis)

    // 生成优化建议
    results.recommendations = this.generateRecommendations(results.analysis)

    console.log(chalk.green('✅ 运行时性能分析完成'))
    return results
  }

  async collectSystemMetrics() {
    const metrics = {
      platform: process.platform,
      nodeVersion: process.version,
      architecture: process.arch,
      cpuCount: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      loadAverage: os.loadavg(),
      uptime: os.uptime(),
    }

    // 计算内存使用率
    metrics.memoryUsagePercent = Math.round(((metrics.totalMemory - metrics.freeMemory) / metrics.totalMemory) * 100)

    return metrics
  }

  analyzeMemoryUsage() {
    const memUsage = process.memoryUsage()

    return {
      rss: memUsage.rss, // 常驻集大小
      heapTotal: memUsage.heapTotal, // 堆总大小
      heapUsed: memUsage.heapUsed, // 已使用堆大小
      external: memUsage.external, // 外部内存使用
      arrayBuffers: memUsage.arrayBuffers || 0,
      heapUsagePercent: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
    }
  }

  async checkPerformanceConfiguration() {
    const config = {
      hasViteConfig: existsSync(resolve(this.projectPath, 'vite.config.js'))
        || existsSync(resolve(this.projectPath, 'vite.config.ts')),
      hasWebpackConfig: existsSync(resolve(this.projectPath, 'webpack.config.js'))
        || existsSync(resolve(this.projectPath, 'webpack.config.ts')),
      hasTsConfig: existsSync(resolve(this.projectPath, 'tsconfig.json')),
      hasEslintConfig: existsSync(resolve(this.projectPath, 'eslint.config.js'))
        || existsSync(resolve(this.projectPath, '.eslintrc.js'))
        || existsSync(resolve(this.projectPath, '.eslintrc.json')),
      hasTailwindConfig: existsSync(resolve(this.projectPath, 'tailwind.config.js'))
        || existsSync(resolve(this.projectPath, 'tailwind.config.ts')),
      hasPostcssConfig: existsSync(resolve(this.projectPath, 'postcss.config.js')),
      hasVitestConfig: existsSync(resolve(this.projectPath, 'vitest.config.js'))
        || existsSync(resolve(this.projectPath, 'vitest.config.ts')),
    }

    // 检查配置文件的优化潜力
    config.optimizationPotential = this.assessOptimizationPotential(config)

    return config
  }

  assessOptimizationPotential(config) {
    const potential = []

    if (config.hasViteConfig || config.hasWebpackConfig) {
      potential.push('构建工具配置存在，可以进行打包优化')
    }

    if (config.hasTsConfig) {
      potential.push('TypeScript配置存在，可以优化编译性能')
    }

    if (config.hasEslintConfig) {
      potential.push('ESLint配置存在，可以优化代码质量检查性能')
    }

    if (config.hasTailwindConfig) {
      potential.push('Tailwind配置存在，可以启用CSS purge优化')
    }

    return potential
  }

  generateSummary(analysis) {
    const { systemMetrics, memoryUsage, performanceConfig } = analysis

    return {
      system: {
        platform: systemMetrics.platform,
        nodeVersion: systemMetrics.nodeVersion,
        cpuCount: systemMetrics.cpuCount,
        totalMemory: this.formatBytes(systemMetrics.totalMemory),
        memoryUsage: `${systemMetrics.memoryUsagePercent}%`,
        loadAverage: systemMetrics.loadAverage[0].toFixed(2),
      },
      process: {
        heapUsed: this.formatBytes(memoryUsage.heapUsed),
        heapTotal: this.formatBytes(memoryUsage.heapTotal),
        heapUsage: `${memoryUsage.heapUsagePercent}%`,
        rss: this.formatBytes(memoryUsage.rss),
      },
      configuration: {
        buildTool: performanceConfig.hasViteConfig
          ? 'Vite'
          : performanceConfig.hasWebpackConfig ? 'Webpack' : 'None',
        typescript: performanceConfig.hasTsConfig,
        linting: performanceConfig.hasEslintConfig,
        testing: performanceConfig.hasVitestConfig,
        styling: performanceConfig.hasTailwindConfig ? 'Tailwind' : 'Standard',
      },
    }
  }

  generateRecommendations(analysis) {
    const recommendations = []
    const { systemMetrics, memoryUsage, performanceConfig } = analysis

    // 系统内存建议
    if (systemMetrics.memoryUsagePercent > 80) {
      recommendations.push({
        type: 'system-memory',
        priority: 'high',
        message: `系统内存使用率过高 (${systemMetrics.memoryUsagePercent}%)，建议关闭不必要的程序或增加内存`,
      })
    }

    // 进程内存建议
    if (memoryUsage.heapUsagePercent > 80) {
      recommendations.push({
        type: 'heap-memory',
        priority: 'medium',
        message: `Node.js 堆内存使用率较高 (${memoryUsage.heapUsagePercent}%)，可能存在内存泄漏`,
      })
    }

    // CPU 负载建议
    if (systemMetrics.loadAverage[0] > systemMetrics.cpuCount) {
      recommendations.push({
        type: 'cpu-load',
        priority: 'medium',
        message: `CPU 负载较高 (${systemMetrics.loadAverage[0].toFixed(2)})，建议优化计算密集型任务`,
      })
    }

    // 配置优化建议
    if (!performanceConfig.hasViteConfig && !performanceConfig.hasWebpackConfig) {
      recommendations.push({
        type: 'build-tool',
        priority: 'medium',
        message: '缺少现代构建工具配置，建议使用 Vite 或 Webpack 优化构建性能',
      })
    }

    if (performanceConfig.hasTsConfig) {
      recommendations.push({
        type: 'typescript',
        priority: 'low',
        message: '可以通过优化 TypeScript 配置来提升编译性能',
      })
    }

    // Node.js 版本建议
    const majorVersion = Number.parseInt(process.version.substring(1).split('.')[0])
    if (majorVersion < 18) {
      recommendations.push({
        type: 'node-version',
        priority: 'medium',
        message: `Node.js 版本较旧 (${process.version})，建议升级到 LTS 版本以获得更好的性能`,
      })
    }

    return recommendations
  }

  formatBytes(bytes) {
    if (bytes === 0)
      return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`
  }
}
