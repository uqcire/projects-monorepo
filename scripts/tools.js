#!/usr/bin/env node

/**
 * 统一工具脚本入口
 * 整合所有monorepo工具功能
 */

import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

// 工具配置
const TOOLS = {
  build: {
    description: '构建相关工具',
    commands: {
      parallel: {
        script: 'parallel-build.js',
        description: '并行构建所有项目',
        usage: 'tools build parallel [options]',
      },
      clean: {
        script: 'clean-build.js',
        description: '清理构建产物',
        usage: 'tools build clean [--build-only|--deps-only|--cache-only|--all]',
      },
      deps: {
        script: 'check-dependencies.js',
        description: '检查依赖版本一致性',
        usage: 'tools build deps',
      },
    },
  },
  perf: {
    description: '性能监控工具',
    commands: {
      'check': {
        script: 'perf-check.js',
        description: '快速性能检查 (3秒)',
        usage: 'tools perf check [--silent]',
      },
      'lite': {
        script: 'performance-monitor-lite.js',
        description: '精简性能监控 (10秒)',
        usage: 'tools perf lite [--quick]',
      },
      'full': {
        script: 'performance-monitor.js',
        description: '完整性能分析 (30秒+)',
        usage: 'tools perf full [options]',
      },
      'test': {
        script: 'test-performance-optimization.js',
        description: '测试性能优化效果',
        usage: 'tools perf test',
      },
      // 专业性能分析命令 (使用 @monorepo/performance-monitor)
      'analyze:all': {
        script: 'performance-analyzer.js',
        description: '运行所有性能分析器',
        usage: 'tools perf analyze:all [project-path]',
        args: ['analyze:all'],
      },
      'analyze:bundle': {
        script: 'performance-analyzer.js',
        description: '分析打包体积和结构',
        usage: 'tools perf analyze:bundle [project-path]',
        args: ['analyze:bundle'],
      },
      'analyze:deps': {
        script: 'performance-analyzer.js',
        description: '分析依赖关系和重复依赖',
        usage: 'tools perf analyze:deps [project-path]',
        args: ['analyze:deps'],
      },
      'analyze:build': {
        script: 'performance-analyzer.js',
        description: '分析构建时间和瓶颈',
        usage: 'tools perf analyze:build [project-path]',
        args: ['analyze:build'],
      },
      'analyze:runtime': {
        script: 'performance-analyzer.js',
        description: '分析运行时性能指标',
        usage: 'tools perf analyze:runtime [project-path]',
        args: ['analyze:runtime'],
      },
      'report:all': {
        script: 'performance-analyzer.js',
        description: '生成所有性能报告',
        usage: 'tools perf report:all [project-path] [output-dir]',
        args: ['report:all'],
      },
      'baseline:set': {
        script: 'performance-analyzer.js',
        description: '设置性能基线',
        usage: 'tools perf baseline:set',
        args: ['baseline:set'],
      },
      'baseline:check': {
        script: 'performance-analyzer.js',
        description: '检查性能基线',
        usage: 'tools perf baseline:check',
        args: ['baseline:check'],
      },
    },
  },
  env: {
    description: '环境管理工具',
    commands: {
      set: {
        script: 'env-manager.js',
        description: '设置项目环境',
        usage: 'tools env set <environment> [project]',
      },
      get: {
        script: 'env-manager.js',
        description: '获取环境配置',
        usage: 'tools env get [project]',
      },
      list: {
        script: 'env-manager.js',
        description: '列出所有可用环境',
        usage: 'tools env list',
      },
      validate: {
        script: 'env-manager.js',
        description: '验证环境配置',
        usage: 'tools env validate [environment]',
      },
      reset: {
        script: 'env-manager.js',
        description: '重置环境配置',
        usage: 'tools env reset [project]',
      },
    },
  },
}

/**
 * 显示帮助信息
 */
function showHelp(category = null) {
  console.log(colorize('\n🛠️  Monorepo 统一工具系统', 'bright'))
  console.log(colorize('='.repeat(50), 'gray'))

  if (category && TOOLS[category]) {
    console.log(colorize(`\n📦 ${category.toUpperCase()} - ${TOOLS[category].description}`, 'yellow'))
    console.log(colorize('-'.repeat(30), 'gray'))

    for (const [cmd, config] of Object.entries(TOOLS[category].commands)) {
      console.log(colorize(`\n  ${cmd}`, 'cyan'))
      console.log(`    ${config.description}`)
      console.log(colorize(`    用法: ${config.usage}`, 'gray'))
    }
  }
  else {
    console.log(colorize('\n📋 可用工具类别:', 'yellow'))

    for (const [category, config] of Object.entries(TOOLS)) {
      console.log(colorize(`\n  ${category}`, 'cyan'))
      console.log(`    ${config.description}`)

      const commands = Object.keys(config.commands).join(', ')
      console.log(colorize(`    命令: ${commands}`, 'gray'))
    }

    console.log(colorize('\n💡 使用说明:', 'yellow'))
    console.log('  tools <category> <command> [args...]')
    console.log('  tools <category> help               # 查看分类帮助')
    console.log('  tools help                          # 查看此帮助')

    console.log(colorize('\n🌟 常用命令:', 'yellow'))
    console.log(`${colorize('  tools perf check', 'green')}               # 快速性能检查`)
    console.log(`${colorize('  tools build clean', 'green')}              # 清理构建产物`)
    console.log(`${colorize('  tools env set development', 'green')}      # 设置开发环境`)
    console.log(`${colorize('  tools build parallel', 'green')}           # 并行构建项目`)
  }

  console.log('')
}

/**
 * 执行工具脚本
 */
async function runTool(category, command, args = []) {
  const tool = TOOLS[category]?.commands[command]

  if (!tool) {
    console.error(colorize(`❌ 未知工具: ${category} ${command}`, 'red'))
    showHelp(category)
    process.exit(1)
  }

  const scriptPath = join(__dirname, tool.script)

  console.log(colorize(`🚀 执行: ${tool.description}`, 'blue'))
  console.log(colorize(`📄 脚本: ${tool.script}`, 'gray'))

  // 特殊处理env命令，需要传递子命令
  let scriptArgs = args
  if (category === 'env') {
    scriptArgs = [command, ...args]
  }

  // 特殊处理有预定义args的命令（如performance-analyzer命令）
  if (tool.args) {
    scriptArgs = [...tool.args, ...args]
  }

  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath, ...scriptArgs], {
      stdio: 'inherit',
      cwd: process.cwd(),
    })

    child.on('close', (code) => {
      if (code === 0) {
        console.log(colorize(`\n✅ 工具执行完成`, 'green'))
        resolve()
      }
      else {
        // 对于性能检查工具，退出码1表示发现问题但不是错误
        if (tool.script === 'perf-check.js' && code === 1) {
          console.log(colorize(`\n⚠️  性能检查发现问题`, 'yellow'))
          console.log(colorize(`💡 提示: 安全漏洞和性能警告不会阻止工具运行`, 'gray'))
          console.log(colorize(`   使用 'tools perf lite' 获取详细分析`, 'gray'))
          resolve() // 正常结束，不抛出错误
        }
        else {
          console.error(colorize(`\n❌ 工具执行失败 (退出码: ${code})`, 'red'))
          reject(new Error(`Tool failed with exit code ${code}`))
        }
      }
    })

    child.on('error', (error) => {
      console.error(colorize(`❌ 工具执行错误: ${error.message}`, 'red'))
      reject(error)
    })
  })
}

/**
 * 解析命令行参数
 */
function parseArgs() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp()
    process.exit(0)
  }

  const category = args[0]
  const command = args[1]
  const toolArgs = args.slice(2)

  // 检查是否请求分类帮助
  if (command === 'help' || !command) {
    showHelp(category)
    process.exit(0)
  }

  return { category, command, args: toolArgs }
}

/**
 * 主函数
 */
async function main() {
  try {
    const { category, command, args } = parseArgs()
    await runTool(category, command, args)
  }
  catch (error) {
    console.error(colorize(`❌ 执行失败: ${error.message}`, 'red'))
    process.exit(1)
  }
}

// 仅在直接运行时执行
if (process.argv[1] && process.argv[1].includes('tools.js')) {
  main()
}

export default { TOOLS, runTool, showHelp }
