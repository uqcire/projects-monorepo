#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

import chalk from 'chalk'

// 导入性能监控组件
import { BuildTimeAnalyzer, BundleAnalyzer, DependencyAnalyzer, RuntimeAnalyzer } from '../packages/performance-monitor/src/analyzers/index.js'
import { BundleReport, ComparisonReport, PerformanceReport } from '../packages/performance-monitor/src/reports/index.js'

const DEFAULT_CONFIG = {
  outputDir: './performance-reports',
  baselineFile: './performance-baseline.json',
  historyFile: './performance-history.json',
  runAll: true,
  modules: {
    bundle: true,
    dependencies: true,
    build: false, // 默认关闭构建分析（耗时较长）
    runtime: true,
  },
  reports: {
    individual: true,
    comprehensive: true,
    comparison: true,
  },
}

class PerformanceMonitor {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.projectPath = process.cwd()
    this.results = {}
  }

  async run() {
    console.log(chalk.bold.blue('🚀 开始性能监控分析...\n'))

    try {
      // 创建输出目录
      this.ensureOutputDirectory()

      // 运行分析
      await this.runAnalysis()

      // 生成报告
      await this.generateReports()

      // 保存历史数据
      await this.saveHistoricalData()

      console.log(chalk.bold.green('\n✅ 性能监控完成!'))
      this.printSummary()
    }
    catch (error) {
      console.error(chalk.red('❌ 性能监控失败:'), error.message)
      process.exit(1)
    }
  }

  ensureOutputDirectory() {
    if (!existsSync(this.config.outputDir)) {
      mkdirSync(this.config.outputDir, { recursive: true })
      console.log(chalk.gray(`📁 创建输出目录: ${this.config.outputDir}`))
    }
  }

  async runAnalysis() {
    console.log(chalk.bold('🔍 执行性能分析...\n'))

    // 打包分析
    if (this.config.modules.bundle) {
      console.log(chalk.blue('🔍 分析打包体积...'))
      const bundleAnalyzer = new BundleAnalyzer(this.projectPath)
      this.results.bundle = await bundleAnalyzer.analyze()
    }

    // 依赖分析
    if (this.config.modules.dependencies) {
      console.log(chalk.blue('🔍 分析项目依赖...'))
      const dependencyAnalyzer = new DependencyAnalyzer(this.projectPath)
      this.results.dependencies = await dependencyAnalyzer.analyze()
    }

    // 构建时间分析
    if (this.config.modules.build) {
      console.log(chalk.blue('🔍 分析构建时间...'))
      const buildTimeAnalyzer = new BuildTimeAnalyzer(this.projectPath)
      this.results.build = await buildTimeAnalyzer.analyze()
    }

    // 运行时分析
    if (this.config.modules.runtime) {
      console.log(chalk.blue('🔍 分析运行时性能...'))
      const runtimeAnalyzer = new RuntimeAnalyzer(this.projectPath)
      this.results.runtime = await runtimeAnalyzer.analyze()
    }

    console.log(chalk.green('✅ 分析完成!\n'))
  }

  async generateReports() {
    console.log(chalk.bold('📊 生成性能报告...\n'))

    // 个人模块报告
    if (this.config.reports.individual) {
      if (this.results.bundle) {
        const bundleReport = new BundleReport(this.results.bundle)
        await bundleReport.generate(this.config.outputDir)
      }
    }

    // 综合性能报告
    if (this.config.reports.comprehensive) {
      const performanceReport = new PerformanceReport(this.results)
      await performanceReport.generate(this.config.outputDir)
    }

    // 对比报告
    if (this.config.reports.comparison) {
      const historicalData = this.loadHistoricalData()
      const comparisonReport = new ComparisonReport(this.results, historicalData)
      await comparisonReport.generate(this.config.outputDir)
    }

    console.log(chalk.green('✅ 报告生成完成!\n'))
  }

  async saveHistoricalData() {
    try {
      // 添加时间戳
      const dataPoint = {
        ...this.results,
        timestamp: new Date().toISOString(),
        version: this.getProjectVersion(),
      }

      // 读取现有历史数据
      let history = []
      if (existsSync(this.config.historyFile)) {
        const content = readFileSync(this.config.historyFile, 'utf-8')
        history = JSON.parse(content)
      }

      // 添加新数据点
      history.push(dataPoint)

      // 限制历史数据数量（保留最近50个数据点）
      if (history.length > 50) {
        history = history.slice(-50)
      }

      // 保存历史数据
      writeFileSync(this.config.historyFile, JSON.stringify(history, null, 2))

      // 如果没有基线，将第一次结果作为基线
      if (!existsSync(this.config.baselineFile)) {
        writeFileSync(this.config.baselineFile, JSON.stringify(dataPoint, null, 2))
        console.log(chalk.gray('📋 保存性能基线数据'))
      }

      console.log(chalk.gray('💾 保存历史数据'))
    }
    catch (error) {
      console.warn(chalk.yellow('⚠️ 保存历史数据失败:'), error.message)
    }
  }

  loadHistoricalData() {
    try {
      if (existsSync(this.config.historyFile)) {
        const content = readFileSync(this.config.historyFile, 'utf-8')
        return JSON.parse(content)
      }
    }
    catch (error) {
      console.warn(chalk.yellow('⚠️ 读取历史数据失败:'), error.message)
    }
    return []
  }

  getProjectVersion() {
    try {
      const packageJsonPath = resolve(this.projectPath, 'package.json')
      if (existsSync(packageJsonPath)) {
        const content = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
        return content.version || '0.0.0'
      }
    }
    catch {
      // 忽略错误
    }
    return '0.0.0'
  }

  printSummary() {
    console.log(chalk.bold('📋 执行摘要:'))

    // 打印各模块结果
    if (this.results.bundle) {
      const bundleSize = this.results.bundle.analysis?.dist?.totalSize || 0
      console.log(`  📦 打包体积: ${chalk.cyan(this.formatBytes(bundleSize))}`)
    }

    if (this.results.dependencies) {
      const healthScore = this.results.dependencies.analysis?.healthScore || 0
      const color = healthScore >= 80 ? 'green' : healthScore >= 60 ? 'yellow' : 'red'
      console.log(`  📦 依赖健康度: ${chalk[color](healthScore)} 分`)
    }

    if (this.results.build) {
      const buildTime = this.results.build.analysis?.parallelBuildTime || 0
      console.log(`  ⚡ 构建时间: ${chalk.cyan(this.formatTime(buildTime))}`)
    }

    if (this.results.runtime) {
      const memUsage = this.results.runtime.analysis?.systemMetrics?.memoryUsagePercent || 0
      console.log(`  🖥️ 内存使用: ${chalk.cyan(memUsage)}%`)
    }

    console.log(`\n📁 报告位置: ${chalk.gray(this.config.outputDir)}`)
  }

  formatBytes(bytes) {
    if (bytes === 0)
      return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`
  }

  formatTime(milliseconds) {
    if (milliseconds < 1000)
      return `${milliseconds}ms`
    if (milliseconds < 60000)
      return `${Math.round(milliseconds / 100) / 10}s`
    return `${Math.round(milliseconds / 6000) / 10}min`
  }
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2)
  const config = { ...DEFAULT_CONFIG }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--output':
      case '-o':
        config.outputDir = args[++i]
        break
      case '--no-bundle':
        config.modules.bundle = false
        break
      case '--no-deps':
        config.modules.dependencies = false
        break
      case '--build':
        config.modules.build = true
        break
      case '--no-runtime':
        config.modules.runtime = false
        break
      case '--no-comparison':
        config.reports.comparison = false
        break
      case '--help':
      case '-h':
        printHelp()
        process.exit(0)
        break
    }
  }

  return config
}

function printHelp() {
  console.log(chalk.bold('性能监控工具'))
  console.log('')
  console.log(chalk.bold('用法:'))
  console.log('  node scripts/performance-monitor.js [选项]')
  console.log('')
  console.log(chalk.bold('选项:'))
  console.log('  -o, --output <dir>     指定输出目录 (默认: ./performance-reports)')
  console.log('  --no-bundle           跳过打包分析')
  console.log('  --no-deps            跳过依赖分析')
  console.log('  --build              启用构建时间分析 (默认关闭)')
  console.log('  --no-runtime         跳过运行时分析')
  console.log('  --no-comparison      跳过对比报告')
  console.log('  -h, --help           显示帮助信息')
  console.log('')
  console.log(chalk.bold('示例:'))
  console.log('  node scripts/performance-monitor.js')
  console.log('  node scripts/performance-monitor.js --build --output ./reports')
  console.log('  node scripts/performance-monitor.js --no-deps --no-runtime')
}

// 主函数
async function main() {
  const config = parseArgs()
  const monitor = new PerformanceMonitor(config)
  await monitor.run()
}

// 仅在直接运行时执行
if (process.argv[1] && process.argv[1].includes('performance-monitor.js')) {
  main().catch((error) => {
    console.error(chalk.red('执行失败:'), error)
    process.exit(1)
  })
}

export default PerformanceMonitor
