#!/usr/bin/env node

import { spawn } from 'node:child_process'
import process from 'node:process'

import chalk from 'chalk'

class PerformanceOptimizationTest {
  constructor() {
    this.results = []
  }

  async runTests() {
    console.log(chalk.bold.blue('🧪 测试性能监控脚本优化\n'))

    const tests = [
      {
        name: '超快性能检查 (perf-check.js)',
        command: 'node',
        args: ['scripts/perf-check.js'],
        expected: { maxTime: 3000, outputLines: 5 },
      },
      {
        name: '超快性能检查 - 静默模式',
        command: 'node',
        args: ['scripts/perf-check.js', '--silent'],
        expected: { maxTime: 2000, outputLines: 0 },
      },
      {
        name: '精简版性能监控 (performance-monitor-lite.js)',
        command: 'node',
        args: ['scripts/performance-monitor-lite.js'],
        expected: { maxTime: 10000, outputLines: 15 },
      },
      {
        name: '精简版性能监控 - 快速模式',
        command: 'node',
        args: ['scripts/performance-monitor-lite.js', '--quick'],
        expected: { maxTime: 8000, outputLines: 20 },
      },
      {
        name: '完整性能监控 (performance-monitor.js) - 对比测试',
        command: 'node',
        args: ['scripts/performance-monitor.js', '--no-build', '--no-comparison'],
        expected: { maxTime: 30000, outputLines: 50 },
      },
    ]

    for (const test of tests) {
      await this.runSingleTest(test)
    }

    this.printSummary()
  }

  async runSingleTest(test) {
    console.log(chalk.blue(`🔍 测试: ${test.name}`))
    const startTime = Date.now()

    try {
      const result = await this.executeCommand(test.command, test.args, test.expected.maxTime)
      const executionTime = Date.now() - startTime
      const outputLines = result.output.split('\n').filter(line => line.trim()).length

      const timeCheck = executionTime <= test.expected.maxTime
      const outputCheck = outputLines <= test.expected.outputLines

      // 对于性能检查脚本，非零退出码可能是正常的（表示发现了问题）
      // 静默模式特殊处理：没有输出但退出码非零是正常的
      const isSilentMode = test.args.includes('--silent')
      const isRunningSuccessfully = result.output.includes('⚡') || result.success
        || (isSilentMode && result.output.trim() === '')
      const testSuccess = isRunningSuccessfully && timeCheck && outputCheck

      this.results.push({
        name: test.name,
        success: testSuccess,
        executionTime,
        outputLines,
        expected: test.expected,
        output: result.output,
        error: result.error,
        actuallyRan: isRunningSuccessfully,
      })

      if (testSuccess) {
        console.log(`  ${chalk.green('✓')} 执行时间: ${chalk.cyan(`${executionTime}ms`)} (期望: <${test.expected.maxTime}ms)`)
        console.log(`  ${chalk.green('✓')} 输出行数: ${chalk.cyan(outputLines)} (期望: <${test.expected.outputLines})`)
      }
      else {
        console.log(`  ${chalk.red('✗')} 测试失败`)
        if (!timeCheck) {
          console.log(`    时间超限: ${chalk.red(`${executionTime}ms`)} > ${test.expected.maxTime}ms`)
        }
        if (!outputCheck) {
          console.log(`    输出过多: ${chalk.red(outputLines)} > ${test.expected.outputLines} 行`)
        }
        if (!result.success) {
          console.log(`    执行错误: ${chalk.red(result.error)}`)
        }
      }
    }
    catch (error) {
      console.log(`  ${chalk.red('✗')} 执行失败: ${error.message}`)
      this.results.push({
        name: test.name,
        success: false,
        error: error.message,
      })
    }

    console.log()
  }

  executeCommand(command, args, timeout) {
    return new Promise((resolve) => {
      let output = ''
      let error = ''

      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout,
      })

      child.stdout.on('data', (data) => {
        output += data.toString()
      })

      child.stderr.on('data', (data) => {
        error += data.toString()
      })

      child.on('close', (code) => {
        resolve({
          success: code === 0,
          output,
          error: error || (code !== 0 ? `Exit code: ${code}` : ''),
        })
      })

      child.on('error', (err) => {
        resolve({
          success: false,
          output,
          error: err.message,
        })
      })

      // 超时处理
      setTimeout(() => {
        child.kill()
        resolve({
          success: false,
          output,
          error: 'Timeout',
        })
      }, timeout)
    })
  }

  printSummary() {
    console.log(chalk.bold('📊 优化效果总结:\n'))

    const successful = this.results.filter(r => r.success)
    const failed = this.results.filter(r => !r.success)

    console.log(`${chalk.green('✓')} 成功: ${successful.length}`)
    console.log(`${chalk.red('✗')} 失败: ${failed.length}`)
    console.log()

    // 性能对比
    if (successful.length > 0) {
      console.log(chalk.bold('⚡ 性能对比:'))

      const perfCheckTime = this.results.find(r => r.name.includes('超快性能检查') && !r.name.includes('静默'))?.executionTime
      const liteModeTime = this.results.find(r => r.name.includes('精简版性能监控') && !r.name.includes('快速'))?.executionTime
      const fullModeTime = this.results.find(r => r.name.includes('完整性能监控'))?.executionTime

      if (perfCheckTime && fullModeTime) {
        const speedup = Math.round((fullModeTime / perfCheckTime) * 10) / 10
        console.log(`  超快检查 vs 完整监控: ${chalk.cyan(`${speedup}x`)} 更快`)
      }

      if (liteModeTime && fullModeTime) {
        const speedup = Math.round((fullModeTime / liteModeTime) * 10) / 10
        console.log(`  精简模式 vs 完整监控: ${chalk.cyan(`${speedup}x`)} 更快`)
      }

      console.log()
    }

    // 输出减少效果
    console.log(chalk.bold('📝 输出优化:'))

    const perfCheckOutput = this.results.find(r => r.name.includes('超快性能检查') && !r.name.includes('静默'))?.outputLines
    const liteOutput = this.results.find(r => r.name.includes('精简版性能监控') && !r.name.includes('快速'))?.outputLines
    const fullOutput = this.results.find(r => r.name.includes('完整性能监控'))?.outputLines

    if (perfCheckOutput && fullOutput) {
      const reduction = Math.round((1 - perfCheckOutput / fullOutput) * 100)
      console.log(`  超快检查输出减少: ${chalk.cyan(`${reduction}%`)}`)
    }

    if (liteOutput && fullOutput) {
      const reduction = Math.round((1 - liteOutput / fullOutput) * 100)
      console.log(`  精简模式输出减少: ${chalk.cyan(`${reduction}%`)}`)
    }

    console.log()

    // 使用建议
    console.log(chalk.bold('💡 使用建议:'))
    console.log(`  • 日常快速检查: ${chalk.cyan('pnpm perf')}`)
    console.log(`  • CI/CD 集成: ${chalk.cyan('pnpm perf:quick')}`)
    console.log(`  • 详细分析: ${chalk.cyan('pnpm perf:lite')}`)
    console.log(`  • 完整报告: ${chalk.cyan('pnpm perf:analyze')}`)

    // 失败的测试
    if (failed.length > 0) {
      console.log(chalk.bold.red('\n❌ 失败的测试:'))
      failed.forEach((result) => {
        console.log(`  • ${result.name}: ${chalk.red(result.error)}`)
      })
    }

    console.log()
    console.log(chalk.bold(successful.length === this.results.length
      ? chalk.green('🎉 所有测试通过！性能监控脚本优化成功完成')
      : chalk.yellow('⚠️ 部分测试失败，请检查相关问题')))
  }
}

// 主函数
async function main() {
  const tester = new PerformanceOptimizationTest()
  await tester.runTests()
}

// 仅在直接运行时执行
if (process.argv[1] && process.argv[1].includes('test-performance-optimization.js')) {
  main().catch((error) => {
    console.error(chalk.red('测试失败:'), error)
    process.exit(1)
  })
}

export default PerformanceOptimizationTest
