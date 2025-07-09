#!/usr/bin/env node

/**
 * 性能分析器 - performance-monitor 包的统一入口
 * 提供专业的性能监控和分析功能
 */

import { join, resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

// 颜色输出
const colors = {
  reset: '\x1B[0m',
  bright: '\x1B[1m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
  gray: '\x1B[90m',
}

function colorize(text, color) {
  return `${colors[color] || ''}${text}${colors.reset}`
}

// 支持的命令
const COMMANDS = {
  'analyze:all': {
    description: '运行所有性能分析器',
    usage: 'performance-analyzer analyze:all [project-path]',
  },
  'analyze:bundle': {
    description: '分析打包体积和结构',
    usage: 'performance-analyzer analyze:bundle [project-path]',
  },
  'analyze:deps': {
    description: '分析依赖关系和重复依赖',
    usage: 'performance-analyzer analyze:deps [project-path]',
  },
  'analyze:build': {
    description: '分析构建时间和瓶颈',
    usage: 'performance-analyzer analyze:build [project-path]',
  },
  'analyze:runtime': {
    description: '分析运行时性能指标',
    usage: 'performance-analyzer analyze:runtime [project-path]',
  },
  'report:all': {
    description: '生成所有性能报告',
    usage: 'performance-analyzer report:all [project-path] [output-dir]',
  },
  'report:bundle': {
    description: '生成打包分析报告',
    usage: 'performance-analyzer report:bundle [project-path] [output-dir]',
  },
  'report:performance': {
    description: '生成综合性能报告',
    usage: 'performance-analyzer report:performance [project-path] [output-dir]',
  },
  'report:comparison': {
    description: '生成性能对比报告',
    usage: 'performance-analyzer report:comparison [project-path] [output-dir]',
  },
  'baseline:set': {
    description: '设置当前性能状态为基线',
    usage: 'performance-analyzer baseline:set',
  },
  'baseline:check': {
    description: '检查当前性能与基线的差异',
    usage: 'performance-analyzer baseline:check',
  },
  'baseline:clear': {
    description: '清除基线和历史数据',
    usage: 'performance-analyzer baseline:clear',
  },
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(colorize('\n🔬 性能分析器 - 专业性能监控工具', 'bright'))
  console.log(colorize('='.repeat(60), 'gray'))

  console.log(colorize('\n📊 分析命令:', 'yellow'))
  const analyzeCommands = Object.entries(COMMANDS).filter(([cmd]) => cmd.startsWith('analyze:'))
  for (const [cmd, config] of analyzeCommands) {
    console.log(colorize(`\n  ${cmd}`, 'cyan'))
    console.log(`    ${config.description}`)
    console.log(colorize(`    ${config.usage}`, 'gray'))
  }

  console.log(colorize('\n📈 报告命令:', 'yellow'))
  const reportCommands = Object.entries(COMMANDS).filter(([cmd]) => cmd.startsWith('report:'))
  for (const [cmd, config] of reportCommands) {
    console.log(colorize(`\n  ${cmd}`, 'cyan'))
    console.log(`    ${config.description}`)
    console.log(colorize(`    ${config.usage}`, 'gray'))
  }

  console.log(colorize('\n📋 基线管理:', 'yellow'))
  const baselineCommands = Object.entries(COMMANDS).filter(([cmd]) => cmd.startsWith('baseline:'))
  for (const [cmd, config] of baselineCommands) {
    console.log(colorize(`\n  ${cmd}`, 'cyan'))
    console.log(`    ${config.description}`)
    console.log(colorize(`    ${config.usage}`, 'gray'))
  }

  console.log(colorize('\n💡 使用说明:', 'yellow'))
  console.log('  performance-analyzer <command> [args...]')
  console.log('  performance-analyzer help                  # 查看此帮助')

  console.log(colorize('\n🌟 常用命令:', 'yellow'))
  console.log(`${colorize('  performance-analyzer analyze:all', 'green')}          # 完整性能分析`)
  console.log(`${colorize('  performance-analyzer analyze:deps', 'green')}         # 依赖关系分析`)
  console.log(`${colorize('  performance-analyzer report:all', 'green')}           # 生成所有报告`)
  console.log(`${colorize('  performance-analyzer baseline:set', 'green')}         # 设置性能基线`)

  console.log('')
}

/**
 * 获取 performance-monitor 包路径
 */
function getPerformanceMonitorPath() {
  const projectRoot = resolve(process.cwd())
  return join(projectRoot, 'packages/performance-monitor')
}

/**
 * 动态导入 performance-monitor 包
 */
async function importPerformanceMonitor() {
  try {
    const perfMonitorPath = getPerformanceMonitorPath()
    const indexPath = join(perfMonitorPath, 'src/index.js')
    const indexUrl = pathToFileURL(indexPath).href

    return await import(indexUrl)
  }
  catch (error) {
    console.error(colorize('❌ 无法导入 performance-monitor 包:', 'red'))
    console.error(colorize(`   ${error.message}`, 'gray'))
    console.error(colorize('💡 确保在 monorepo 根目录运行此命令', 'yellow'))
    process.exit(1)
  }
}

/**
 * 动态导入基线管理器
 */
async function importBaselineManager() {
  try {
    const perfMonitorPath = getPerformanceMonitorPath()
    const baselinePath = join(perfMonitorPath, 'src/utils/baseline-manager.js')
    const baselineUrl = pathToFileURL(baselinePath).href

    return await import(baselineUrl)
  }
  catch (error) {
    console.error(colorize('❌ 无法导入基线管理器:', 'red'))
    console.error(colorize(`   ${error.message}`, 'gray'))
    process.exit(1)
  }
}

/**
 * 执行分析命令
 */
async function runAnalyzeCommand(command, projectPath = '.') {
  console.log(colorize(`🔍 开始执行: ${COMMANDS[command].description}`, 'blue'))

  const perfMonitor = await importPerformanceMonitor()
  const fullProjectPath = resolve(projectPath)

  try {
    let result

    switch (command) {
      case 'analyze:all': {
        result = await perfMonitor.analyzeAll(fullProjectPath)
        console.log(colorize('\n✅ 完整性能分析完成', 'green'))
        console.log(colorize(`📊 分析了 ${Object.keys(result).length} 个性能维度`, 'cyan'))
        break
      }

      case 'analyze:bundle': {
        const { BundleAnalyzer } = perfMonitor
        const analyzer = new BundleAnalyzer(fullProjectPath)
        result = await analyzer.analyze()
        console.log(colorize('\n✅ 打包分析完成', 'green'))
        break
      }

      case 'analyze:deps': {
        const { DependencyAnalyzer } = perfMonitor
        const analyzer = new DependencyAnalyzer(fullProjectPath)
        result = await analyzer.analyze()
        console.log(colorize('\n✅ 依赖分析完成', 'green'))
        break
      }

      case 'analyze:build': {
        const { BuildTimeAnalyzer } = perfMonitor
        const analyzer = new BuildTimeAnalyzer(fullProjectPath)
        result = await analyzer.analyze()
        console.log(colorize('\n✅ 构建时间分析完成', 'green'))
        break
      }

      case 'analyze:runtime': {
        const { RuntimeAnalyzer } = perfMonitor
        const analyzer = new RuntimeAnalyzer(fullProjectPath)
        result = await analyzer.analyze()
        console.log(colorize('\n✅ 运行时分析完成', 'green'))
        break
      }

      default:
        throw new Error(`未知的分析命令: ${command}`)
    }

    return result
  }
  catch (error) {
    console.error(colorize(`❌ 分析失败: ${error.message}`, 'red'))
    process.exit(1)
  }
}

/**
 * 执行报告命令
 */
async function runReportCommand(command, projectPath = '.', outputDir = './performance-reports') {
  console.log(colorize(`📊 开始生成: ${COMMANDS[command].description}`, 'blue'))

  const perfMonitor = await importPerformanceMonitor()
  const fullProjectPath = resolve(projectPath)
  const fullOutputDir = resolve(outputDir)

  try {
    let result

    switch (command) {
      case 'report:all': {
        // 先进行完整分析
        const analysisData = await perfMonitor.analyzeAll(fullProjectPath)
        // 然后生成所有报告
        result = await perfMonitor.generateAllReports(analysisData, fullOutputDir)
        console.log(colorize('\n✅ 所有报告生成完成', 'green'))
        console.log(colorize(`📁 报告目录: ${fullOutputDir}`, 'cyan'))
        break
      }

      case 'report:bundle': {
        const { BundleAnalyzer, BundleReport } = perfMonitor
        const analyzer = new BundleAnalyzer(fullProjectPath)
        const analysisData = await analyzer.analyze()
        const report = new BundleReport(analysisData)
        result = await report.generate(fullOutputDir)
        console.log(colorize('\n✅ 打包报告生成完成', 'green'))
        break
      }

      case 'report:performance': {
        const analysisData = await perfMonitor.analyzeAll(fullProjectPath)
        const { PerformanceReport } = perfMonitor
        const report = new PerformanceReport(analysisData)
        result = await report.generate(fullOutputDir)
        console.log(colorize('\n✅ 性能报告生成完成', 'green'))
        break
      }

      case 'report:comparison': {
        const analysisData = await perfMonitor.analyzeAll(fullProjectPath)
        const { ComparisonReport } = perfMonitor
        const report = new ComparisonReport(analysisData)
        result = await report.generate(fullOutputDir)
        console.log(colorize('\n✅ 对比报告生成完成', 'green'))
        break
      }

      default:
        throw new Error(`未知的报告命令: ${command}`)
    }

    if (result && result.html) {
      console.log(colorize(`🌐 HTML报告: ${result.html}`, 'cyan'))
    }
    if (result && result.json) {
      console.log(colorize(`📄 JSON报告: ${result.json}`, 'cyan'))
    }

    return result
  }
  catch (error) {
    console.error(colorize(`❌ 报告生成失败: ${error.message}`, 'red'))
    process.exit(1)
  }
}

/**
 * 执行基线管理命令
 */
async function runBaselineCommand(command) {
  console.log(colorize(`📋 开始执行: ${COMMANDS[command].description}`, 'blue'))

  try {
    const baselineModule = await importBaselineManager()
    const BaselineManager = baselineModule.default

    const manager = new BaselineManager()

    switch (command) {
      case 'baseline:set':
        await manager.setBaseline()
        break

      case 'baseline:check':
        await manager.checkBaseline()
        break

      case 'baseline:clear':
        manager.clearBaseline()
        break

      default:
        throw new Error(`未知的基线命令: ${command}`)
    }
  }
  catch (error) {
    console.error(colorize(`❌ 基线管理失败: ${error.message}`, 'red'))
    process.exit(1)
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp()
    return
  }

  const command = args[0]

  if (!COMMANDS[command]) {
    console.error(colorize(`❌ 未知命令: ${command}`, 'red'))
    showHelp()
    process.exit(1)
  }

  try {
    if (command.startsWith('analyze:')) {
      const projectPath = args[1] || '.'
      await runAnalyzeCommand(command, projectPath)
    }
    else if (command.startsWith('report:')) {
      const projectPath = args[1] || '.'
      const outputDir = args[2] || './performance-reports'
      await runReportCommand(command, projectPath, outputDir)
    }
    else if (command.startsWith('baseline:')) {
      await runBaselineCommand(command)
    }
    else {
      throw new Error(`未支持的命令类别: ${command}`)
    }

    console.log(colorize('\n🎉 命令执行完成!', 'green'))
  }
  catch (error) {
    console.error(colorize(`❌ 执行失败: ${error.message}`, 'red'))
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(colorize(`❌ 程序异常: ${error.message}`, 'red'))
    process.exit(1)
  })
}
