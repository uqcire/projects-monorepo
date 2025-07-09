#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'

import chalk from 'chalk'

// 导入性能监控组件
import { BundleAnalyzer, DependencyAnalyzer, RuntimeAnalyzer } from '../packages/performance-monitor/src/analyzers/index.js'

const LITE_CONFIG = {
  outputDir: './performance-reports',
  baselineFile: './performance-baseline.json',
  quick: false,
  silent: false,
  modules: {
    bundle: true,
    dependencies: true,
    runtime: true,
  },
}

class PerformanceMonitorLite {
  constructor(config = {}) {
    this.config = { ...LITE_CONFIG, ...config }
    this.projectPath = process.cwd()
    this.results = {}
    this.startTime = Date.now()
  }

  async run() {
    if (!this.config.silent) {
      console.log(chalk.blue('⚡ 快速性能检查...'))
    }

    try {
      await this.runQuickAnalysis()
      this.printResults()
    }
    catch (error) {
      if (!this.config.silent) {
        console.error(chalk.red('❌ 性能检查失败:'), error.message)
      }
      process.exit(1)
    }
  }

  async runQuickAnalysis() {
    const promises = []

    // 并行运行所有分析
    if (this.config.modules.bundle) {
      promises.push(this.analyzeBundleQuick())
    }

    if (this.config.modules.dependencies) {
      promises.push(this.analyzeDependenciesQuick())
    }

    if (this.config.modules.runtime) {
      promises.push(this.analyzeRuntimeQuick())
    }

    await Promise.all(promises)
  }

  async analyzeBundleQuick() {
    try {
      const bundleAnalyzer = new BundleAnalyzer(this.projectPath)
      const result = await bundleAnalyzer.analyze()
      this.results.bundle = {
        totalSize: result.analysis?.dist?.totalSize || 0,
        fileCount: result.analysis?.dist?.fileCount || 0,
        largestFile: result.analysis?.dist?.largestFile || null,
      }
    }
    catch (error) {
      this.results.bundle = { error: error.message }
    }
  }

  async analyzeDependenciesQuick() {
    try {
      const depAnalyzer = new DependencyAnalyzer(this.projectPath)
      const result = await depAnalyzer.analyze()
      this.results.dependencies = {
        healthScore: result.analysis?.healthScore || 0,
        outdated: result.analysis?.outdated?.length || 0,
        vulnerabilities: result.analysis?.vulnerabilities?.length || 0,
        duplicates: result.analysis?.duplicates?.length || 0,
      }
    }
    catch (error) {
      this.results.dependencies = { error: error.message }
    }
  }

  async analyzeRuntimeQuick() {
    try {
      const runtimeAnalyzer = new RuntimeAnalyzer(this.projectPath)
      const result = await runtimeAnalyzer.analyze()
      this.results.runtime = {
        memoryUsage: result.analysis?.systemMetrics?.memoryUsagePercent || 0,
        nodeVersion: result.analysis?.nodeVersion || process.version,
        platform: result.analysis?.platform || process.platform,
      }
    }
    catch (error) {
      this.results.runtime = { error: error.message }
    }
  }

  printResults() {
    if (this.config.silent)
      return

    const executionTime = Date.now() - this.startTime

    // 打印简洁的结果
    console.log(chalk.bold('\n📊 性能概览:'))

    // 打包分析结果
    if (this.results.bundle) {
      if (this.results.bundle.error) {
        console.log(`  📦 打包: ${chalk.red('检查失败')}`)
      }
      else {
        const size = this.formatBytes(this.results.bundle.totalSize)
        const color = this.results.bundle.totalSize > 5 * 1024 * 1024 ? 'yellow' : 'green'
        console.log(`  📦 打包: ${chalk[color](size)} (${this.results.bundle.fileCount} 文件)`)

        if (this.config.quick && this.results.bundle.largestFile) {
          const largestSize = this.formatBytes(this.results.bundle.largestFile.size)
          console.log(`    └─ 最大: ${this.results.bundle.largestFile.name} (${largestSize})`)
        }
      }
    }

    // 依赖分析结果
    if (this.results.dependencies) {
      if (this.results.dependencies.error) {
        console.log(`  📦 依赖: ${chalk.red('检查失败')}`)
      }
      else {
        const health = this.results.dependencies.healthScore
        const color = health >= 80 ? 'green' : health >= 60 ? 'yellow' : 'red'
        console.log(`  📦 依赖: ${chalk[color](`${health}分`)}`)

        if (this.config.quick) {
          const issues = []
          if (this.results.dependencies.outdated > 0) {
            issues.push(`${this.results.dependencies.outdated} 过时`)
          }
          if (this.results.dependencies.vulnerabilities > 0) {
            issues.push(`${this.results.dependencies.vulnerabilities} 漏洞`)
          }
          if (this.results.dependencies.duplicates > 0) {
            issues.push(`${this.results.dependencies.duplicates} 重复`)
          }

          if (issues.length > 0) {
            console.log(`    └─ 问题: ${chalk.yellow(issues.join(', '))}`)
          }
        }
      }
    }

    // 运行时分析结果
    if (this.results.runtime) {
      if (this.results.runtime.error) {
        console.log(`  🖥️ 运行时: ${chalk.red('检查失败')}`)
      }
      else {
        const memory = this.results.runtime.memoryUsage
        const color = memory > 80 ? 'red' : memory > 60 ? 'yellow' : 'green'
        console.log(`  🖥️ 运行时: ${chalk[color](`内存 ${memory}%`)}`)

        if (this.config.quick) {
          console.log(`    └─ 环境: ${this.results.runtime.nodeVersion} on ${this.results.runtime.platform}`)
        }
      }
    }

    // 与基线对比
    this.printBaselineComparison()

    // 执行时间
    console.log(`\n⚡ 完成于 ${chalk.gray(`${executionTime}ms`)}`)

    // 建议
    this.printRecommendations()
  }

  printBaselineComparison() {
    try {
      if (!existsSync(this.config.baselineFile))
        return

      const baseline = JSON.parse(readFileSync(this.config.baselineFile, 'utf-8'))

      // 比较打包体积
      if (this.results.bundle && baseline.bundle?.analysis?.dist?.totalSize) {
        const current = this.results.bundle.totalSize
        const base = baseline.bundle.analysis.dist.totalSize
        const diff = current - base
        const percent = ((diff / base) * 100).toFixed(1)

        if (Math.abs(diff) > base * 0.05) { // 超过5%变化才显示
          const color = diff > 0 ? 'red' : 'green'
          const symbol = diff > 0 ? '↗' : '↘'
          console.log(`    ${symbol} 对比基线: ${chalk[color](`${percent}%`)} (${this.formatBytes(diff)})`)
        }
      }
    }
    catch {
      // 忽略基线比较错误
    }
  }

  printRecommendations() {
    const recommendations = []

    // 基于结果生成建议
    if (this.results.bundle?.totalSize > 5 * 1024 * 1024) {
      recommendations.push('考虑代码分割减少包体积')
    }

    if (this.results.dependencies?.healthScore < 70) {
      recommendations.push('更新过时依赖并修复安全漏洞')
    }

    if (this.results.runtime?.memoryUsage > 80) {
      recommendations.push('检查内存泄漏和优化代码')
    }

    if (recommendations.length > 0) {
      console.log(`\n💡 建议:`)
      recommendations.forEach(rec => console.log(`  • ${chalk.yellow(rec)}`))
    }
  }

  formatBytes(bytes) {
    if (bytes === 0)
      return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`
  }
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2)
  const config = { ...LITE_CONFIG }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--quick':
      case '-q':
        config.quick = true
        break
      case '--silent':
      case '-s':
        config.silent = true
        break
      case '--bundle-only':
        config.modules = { bundle: true, dependencies: false, runtime: false }
        break
      case '--deps-only':
        config.modules = { bundle: false, dependencies: true, runtime: false }
        break
      case '--runtime-only':
        config.modules = { bundle: false, dependencies: false, runtime: true }
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
  console.log(chalk.bold('精简版性能监控工具'))
  console.log('')
  console.log(chalk.bold('用法:'))
  console.log('  node scripts/performance-monitor-lite.js [选项]')
  console.log('')
  console.log(chalk.bold('选项:'))
  console.log('  -q, --quick          显示额外详细信息')
  console.log('  -s, --silent         静默模式，仅返回退出代码')
  console.log('  --bundle-only        仅检查打包体积')
  console.log('  --deps-only          仅检查依赖健康度')
  console.log('  --runtime-only       仅检查运行时性能')
  console.log('  -h, --help           显示帮助信息')
  console.log('')
  console.log(chalk.bold('示例:'))
  console.log('  node scripts/performance-monitor-lite.js')
  console.log('  node scripts/performance-monitor-lite.js --quick')
  console.log('  node scripts/performance-monitor-lite.js --bundle-only --silent')
}

// 主函数
async function main() {
  const config = parseArgs()
  const monitor = new PerformanceMonitorLite(config)
  await monitor.run()
}

// 仅在直接运行时执行
if (process.argv[1] && process.argv[1].includes('performance-monitor-lite.js')) {
  main().catch((error) => {
    console.error(chalk.red('执行失败:'), error)
    process.exit(1)
  })
}

export default PerformanceMonitorLite
