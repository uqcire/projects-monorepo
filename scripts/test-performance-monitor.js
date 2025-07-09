#!/usr/bin/env node

import process from 'node:process'

import chalk from 'chalk'

// 导入性能监控组件
import { DependencyAnalyzer } from '../packages/performance-monitor/src/analyzers/DependencyAnalyzer.js'
import { RuntimeAnalyzer } from '../packages/performance-monitor/src/analyzers/RuntimeAnalyzer.js'
import { PerformanceReport } from '../packages/performance-monitor/src/reports/PerformanceReport.js'

async function testPerformanceMonitor() {
  console.log(chalk.bold.blue('🧪 测试性能监控系统...\n'))

  try {
    const results = {}

    // 测试依赖分析器
    console.log(chalk.blue('🔍 测试依赖分析器...'))
    const dependencyAnalyzer = new DependencyAnalyzer('.')
    results.dependencies = await dependencyAnalyzer.analyze()
    console.log(chalk.green('✅ 依赖分析完成'))

    // 测试运行时分析器
    console.log(chalk.blue('🔍 测试运行时分析器...'))
    const runtimeAnalyzer = new RuntimeAnalyzer('.')
    results.runtime = await runtimeAnalyzer.analyze()
    console.log(chalk.green('✅ 运行时分析完成'))

    // 测试报告生成器
    console.log(chalk.blue('📊 测试报告生成器...'))
    const performanceReport = new PerformanceReport(results)
    await performanceReport.generate('./test-reports')
    console.log(chalk.green('✅ 报告生成完成'))

    console.log(chalk.bold.green('\n🎉 性能监控系统测试成功!'))

    // 打印简要结果
    console.log(chalk.bold('\n📋 测试结果摘要:'))
    if (results.dependencies?.summary) {
      console.log(`  依赖健康度: ${chalk.cyan(results.dependencies.summary.healthScore || 'N/A')}`)
    }
    if (results.runtime?.summary) {
      console.log(`  系统平台: ${chalk.cyan(results.runtime.summary.system?.platform || 'N/A')}`)
      console.log(`  Node版本: ${chalk.cyan(results.runtime.summary.system?.nodeVersion || 'N/A')}`)
    }
  }
  catch (error) {
    console.error(chalk.red('❌ 测试失败:'), error.message)
    console.error(chalk.gray(error.stack))
    process.exit(1)
  }
}

// 运行测试
testPerformanceMonitor()
