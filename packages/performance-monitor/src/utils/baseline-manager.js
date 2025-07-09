import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'

import chalk from 'chalk'

import { MetricsCollector } from './MetricsCollector.js'

class BaselineManager {
  constructor() {
    this.projectPath = process.cwd()
    this.baselineFile = resolve(this.projectPath, 'performance-reports', 'baseline.json')
    this.historyFile = resolve(this.projectPath, 'performance-reports', 'history.json')
    this.metrics = new MetricsCollector()
  }

  async setBaseline() {
    console.log(chalk.blue('📋 设置性能基线...'))

    try {
      // 确保输出目录存在
      const outputDir = dirname(this.baselineFile)
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true })
      }

      // 运行性能分析
      const { DependencyAnalyzer } = await import('../analyzers/DependencyAnalyzer.js')
      const { RuntimeAnalyzer } = await import('../analyzers/RuntimeAnalyzer.js')

      const dependencyAnalyzer = new DependencyAnalyzer(this.projectPath)
      const runtimeAnalyzer = new RuntimeAnalyzer(this.projectPath)

      const results = {
        timestamp: new Date().toISOString(),
        version: this.getProjectVersion(),
        dependencies: await dependencyAnalyzer.analyze(),
        runtime: await runtimeAnalyzer.analyze(),
      }

      // 保存基线
      writeFileSync(this.baselineFile, JSON.stringify(results, null, 2))

      console.log(chalk.green('✅ 性能基线已设置'))
      console.log(chalk.gray(`📁 基线文件: ${this.baselineFile}`))

      // 显示基线信息
      this.displayBaselineInfo(results)
    }
    catch (error) {
      console.error(chalk.red('❌ 设置基线失败:'), error.message)
      process.exit(1)
    }
  }

  async checkBaseline() {
    console.log(chalk.blue('🔍 检查性能基线...'))

    if (!existsSync(this.baselineFile)) {
      console.log(chalk.yellow('⚠️ 未找到性能基线，请先运行: pnpm run perf:baseline'))
      return
    }

    try {
      // 读取基线数据
      const baseline = JSON.parse(readFileSync(this.baselineFile, 'utf-8'))

      // 运行当前分析
      const { DependencyAnalyzer } = await import('../analyzers/DependencyAnalyzer.js')
      const { RuntimeAnalyzer } = await import('../analyzers/RuntimeAnalyzer.js')

      const dependencyAnalyzer = new DependencyAnalyzer(this.projectPath)
      const runtimeAnalyzer = new RuntimeAnalyzer(this.projectPath)

      const current = {
        dependencies: await dependencyAnalyzer.analyze(),
        runtime: await runtimeAnalyzer.analyze(),
      }

      // 对比结果
      const comparison = this.compareResults(baseline, current)

      // 显示对比结果
      this.displayComparison(comparison)
    }
    catch (error) {
      console.error(chalk.red('❌ 检查基线失败:'), error.message)
      process.exit(1)
    }
  }

  clearBaseline() {
    console.log(chalk.blue('🗑️ 清除性能基线...'))

    if (existsSync(this.baselineFile)) {
      unlinkSync(this.baselineFile)
      console.log(chalk.green('✅ 性能基线已清除'))
    }
    else {
      console.log(chalk.yellow('⚠️ 性能基线文件不存在'))
    }

    if (existsSync(this.historyFile)) {
      unlinkSync(this.historyFile)
      console.log(chalk.green('✅ 历史数据已清除'))
    }
  }

  compareResults(baseline, current) {
    const comparison = {
      dependencies: this.compareDependencies(baseline.dependencies, current.dependencies),
      runtime: this.compareRuntime(baseline.runtime, current.runtime),
      overall: 'unchanged',
    }

    // 计算总体变化
    if (comparison.dependencies.status === 'improved' || comparison.runtime.status === 'improved') {
      comparison.overall = 'improved'
    }
    else if (comparison.dependencies.status === 'degraded' || comparison.runtime.status === 'degraded') {
      comparison.overall = 'degraded'
    }

    return comparison
  }

  compareDependencies(baseline, current) {
    const baselineScore = baseline.analysis?.healthScore || 0
    const currentScore = current.analysis?.healthScore || 0
    const diff = currentScore - baselineScore

    return {
      status: diff > 5 ? 'improved' : diff < -5 ? 'degraded' : 'unchanged',
      baseline: baselineScore,
      current: currentScore,
      diff,
      message: this.getDependencyMessage(diff),
    }
  }

  compareRuntime(baseline, current) {
    const baselineMemory = baseline.analysis?.systemMetrics?.memoryUsagePercent || 0
    const currentMemory = current.analysis?.systemMetrics?.memoryUsagePercent || 0
    const diff = currentMemory - baselineMemory

    return {
      status: diff < -10 ? 'improved' : diff > 10 ? 'degraded' : 'unchanged',
      baseline: baselineMemory,
      current: currentMemory,
      diff,
      message: this.getMemoryMessage(diff),
    }
  }

  getDependencyMessage(diff) {
    if (diff > 10)
      return '依赖健康度显著提升'
    if (diff > 5)
      return '依赖健康度有所改善'
    if (diff < -10)
      return '依赖健康度明显下降'
    if (diff < -5)
      return '依赖健康度略有下降'
    return '依赖健康度保持稳定'
  }

  getMemoryMessage(diff) {
    if (diff < -10)
      return '内存使用率显著降低'
    if (diff < -5)
      return '内存使用率有所优化'
    if (diff > 15)
      return '内存使用率明显上升'
    if (diff > 10)
      return '内存使用率略有上升'
    return '内存使用率保持稳定'
  }

  displayBaselineInfo(results) {
    console.log(chalk.bold('\n📊 基线信息:'))
    console.log(`  版本: ${results.version}`)
    console.log(`  时间: ${new Date(results.timestamp).toLocaleString()}`)

    if (results.dependencies) {
      const score = results.dependencies.analysis?.healthScore || 0
      console.log(`  📦 依赖健康度: ${score} 分`)
    }

    if (results.runtime) {
      const memory = results.runtime.analysis?.systemMetrics?.memoryUsagePercent || 0
      console.log(`  🖥️ 内存使用率: ${memory}%`)
    }
  }

  displayComparison(comparison) {
    console.log(chalk.bold('\n📊 性能对比结果:'))

    // 总体状态
    const overallColor = comparison.overall === 'improved' ? 'green' : comparison.overall === 'degraded' ? 'red' : 'yellow'
    const overallIcon = comparison.overall === 'improved' ? '⬆️' : comparison.overall === 'degraded' ? '⬇️' : '➡️'
    console.log(`  ${overallIcon} 总体状态: ${chalk[overallColor](comparison.overall)}`)

    // 依赖对比
    console.log('\n  📦 依赖分析:')
    console.log(`     基线: ${comparison.dependencies.baseline} 分`)
    console.log(`     当前: ${comparison.dependencies.current} 分`)
    console.log(`     变化: ${comparison.dependencies.diff > 0 ? '+' : ''}${comparison.dependencies.diff} 分`)
    console.log(`     状态: ${comparison.dependencies.message}`)

    // 运行时对比
    console.log('\n  🖥️ 运行时性能:')
    console.log(`     基线内存: ${comparison.runtime.baseline}%`)
    console.log(`     当前内存: ${comparison.runtime.current}%`)
    console.log(`     变化: ${comparison.runtime.diff > 0 ? '+' : ''}${comparison.runtime.diff}%`)
    console.log(`     状态: ${comparison.runtime.message}`)

    // 建议
    console.log(chalk.bold('\n💡 建议:'))
    if (comparison.overall === 'improved') {
      console.log('  ✅ 性能有所提升，继续保持!')
    }
    else if (comparison.overall === 'degraded') {
      console.log('  ⚠️ 性能有所下降，建议检查最近的更改')
      console.log('  📋 可以运行性能分析找出问题原因')
    }
    else {
      console.log('  ℹ️ 性能保持稳定，继续监控')
    }
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
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2)
  return {
    set: args.includes('--set'),
    check: args.includes('--check'),
    clear: args.includes('--clear'),
    help: args.includes('--help') || args.includes('-h'),
  }
}

function printHelp() {
  console.log(chalk.bold('性能基线管理工具'))
  console.log('')
  console.log(chalk.bold('用法:'))
  console.log('  node src/utils/baseline-manager.js [选项]')
  console.log('')
  console.log(chalk.bold('选项:'))
  console.log('  --set      设置当前性能状态为基线')
  console.log('  --check    检查当前性能与基线的差异')
  console.log('  --clear    清除基线和历史数据')
  console.log('  --help     显示帮助信息')
  console.log('')
  console.log(chalk.bold('示例:'))
  console.log('  node src/utils/baseline-manager.js --set')
  console.log('  node src/utils/baseline-manager.js --check')
  console.log('  node src/utils/baseline-manager.js --clear')
}

// 主函数
async function main() {
  const args = parseArgs()

  if (args.help) {
    printHelp()
    return
  }

  const manager = new BaselineManager()

  if (args.set) {
    await manager.setBaseline()
  }
  else if (args.check) {
    await manager.checkBaseline()
  }
  else if (args.clear) {
    manager.clearBaseline()
  }
  else {
    console.log(chalk.yellow('请指定操作选项，使用 --help 查看帮助'))
  }
}

// 仅在直接运行时执行
if (process.argv[1] && process.argv[1].includes('baseline-manager.js')) {
  main().catch((error) => {
    console.error(chalk.red('执行失败:'), error)
    process.exit(1)
  })
}

export default BaselineManager
