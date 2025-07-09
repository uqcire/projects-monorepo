#!/usr/bin/env node

/**
 * 并行构建脚本
 * 支持构建依赖管理、时间统计和错误处理
 */

import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// 项目配置
const projects = [
  {
    name: 'dflm',
    path: 'packages/apps/dflm',
    packageName: 'dflm-website',
    dependencies: [], // 无依赖，可以并行构建
    buildTime: 0,
    priority: 1,
  },
  {
    name: 'basketball-score',
    path: 'packages/apps/basketball-score',
    packageName: 'project--basketball-stats-app',
    dependencies: [],
    buildTime: 0,
    priority: 1,
  },
  {
    name: 'cirq',
    path: 'packages/apps/cirq',
    packageName: 'Cirq',
    dependencies: [],
    buildTime: 0,
    priority: 1,
  },
  {
    name: 'gcn-website',
    path: 'packages/apps/gcn-website',
    packageName: 'gcn-website',
    dependencies: [],
    buildTime: 0,
    priority: 2, // 较低优先级
  },
  {
    name: 'site-template',
    path: 'packages/apps/site-template',
    packageName: 'project-development-environment--daysi-ui',
    dependencies: [],
    buildTime: 0,
    priority: 3, // 最低优先级
  },
]

// 解析命令行参数
const args = process.argv.slice(2)
const options = {
  command: args[0] || 'build',
  maxConcurrency: Number.parseInt(args.find(arg => arg.startsWith('--max-concurrency='))?.split('=')[1]) || 3,
  verbose: args.includes('--verbose') || args.includes('-v'),
  dryRun: args.includes('--dry-run'),
  skipTests: args.includes('--skip-tests'),
  production: args.includes('--production'),
  development: args.includes('--development'),
  staging: args.includes('--staging'),
}

// 构建状态
const buildStatus = {
  total: projects.length,
  completed: 0,
  failed: 0,
  running: 0,
  results: new Map(),
}

console.log('🚀 并行构建脚本')
console.log('='.repeat(50))
console.log(`📋 构建命令: ${options.command}`)
console.log(`🔧 最大并发数: ${options.maxConcurrency}`)
console.log(`📦 项目数量: ${projects.length}`)

if (options.dryRun) {
  console.log('🔍 DRY RUN 模式 - 不会实际执行构建')
}

/**
 * 执行单个项目的构建
 * @param {object} project - 项目配置
 * @returns {Promise<object>} 构建结果
 */
function buildProject(project) {
  return new Promise((resolve) => {
    const startTime = Date.now()
    buildStatus.running++

    console.log(`🔨 开始构建: ${project.name}`)

    if (options.dryRun) {
      setTimeout(() => {
        const endTime = Date.now()
        const duration = endTime - startTime

        buildStatus.running--
        buildStatus.completed++

        const result = {
          project: project.name,
          success: true,
          duration,
          output: '[DRY RUN] 模拟构建成功',
        }

        buildStatus.results.set(project.name, result)
        console.log(`✅ 构建完成: ${project.name} (${duration}ms)`)
        resolve(result)
      }, Math.random() * 2000 + 1000) // 模拟构建时间
      return
    }

    // 设置环境变量
    const env = { ...process.env }
    if (options.production) {
      env.NODE_ENV = 'production'
    }
    else if (options.development) {
      env.NODE_ENV = 'development'
    }
    else if (options.staging) {
      env.NODE_ENV = 'staging'
    }

    // 构建命令
    const command = 'pnpm'
    const args = ['run', options.command]

    const child = spawn(command, args, {
      cwd: join(projectRoot, project.path),
      env,
      stdio: options.verbose ? 'inherit' : 'pipe',
    })

    let output = ''
    let errorOutput = ''

    if (!options.verbose) {
      child.stdout?.on('data', (data) => {
        output += data.toString()
      })

      child.stderr?.on('data', (data) => {
        errorOutput += data.toString()
      })
    }

    child.on('close', (code) => {
      const endTime = Date.now()
      const duration = endTime - startTime

      buildStatus.running--

      const result = {
        project: project.name,
        success: code === 0,
        duration,
        output: output || errorOutput,
        exitCode: code,
      }

      buildStatus.results.set(project.name, result)

      if (code === 0) {
        buildStatus.completed++
        console.log(`✅ 构建完成: ${project.name} (${(duration / 1000).toFixed(2)}s)`)
      }
      else {
        buildStatus.failed++
        console.error(`❌ 构建失败: ${project.name} (${(duration / 1000).toFixed(2)}s)`)
        if (!options.verbose && (output || errorOutput)) {
          console.error(`   错误输出: ${(output || errorOutput).slice(0, 200)}...`)
        }
      }

      resolve(result)
    })

    child.on('error', (error) => {
      const endTime = Date.now()
      const duration = endTime - startTime

      buildStatus.running--
      buildStatus.failed++

      const result = {
        project: project.name,
        success: false,
        duration,
        output: error.message,
        error,
      }

      buildStatus.results.set(project.name, result)
      console.error(`❌ 构建错误: ${project.name} - ${error.message}`)
      resolve(result)
    })
  })
}

/**
 * 检查项目依赖是否已完成
 * @param {object} project - 项目配置
 * @returns {boolean} 是否可以开始构建
 */
function canStartBuild(project) {
  return project.dependencies.every((dep) => {
    const depResult = buildStatus.results.get(dep)
    return depResult && depResult.success
  })
}

/**
 * 获取下一个可以构建的项目
 * @param {Array} remainingProjects - 剩余项目列表
 * @returns {object | null} 下一个项目或null
 */
function getNextProject(remainingProjects) {
  // 按优先级排序，优先级高的先构建
  const sortedProjects = remainingProjects
    .filter(canStartBuild)
    .sort((a, b) => a.priority - b.priority)

  return sortedProjects[0] || null
}

/**
 * 主构建函数
 */
async function runParallelBuild() {
  const startTime = Date.now()
  const remainingProjects = [...projects]
  const runningBuilds = new Set()

  while (remainingProjects.length > 0 || runningBuilds.size > 0) {
    // 启动新的构建任务
    while (runningBuilds.size < options.maxConcurrency && remainingProjects.length > 0) {
      const nextProject = getNextProject(remainingProjects)

      if (!nextProject) {
        break // 没有可以开始的项目，等待当前任务完成
      }

      // 从剩余项目中移除
      const index = remainingProjects.indexOf(nextProject)
      remainingProjects.splice(index, 1)

      // 开始构建
      const buildPromise = buildProject(nextProject)
      runningBuilds.add(buildPromise)

      // 构建完成后从运行集合中移除
      buildPromise.then(() => {
        runningBuilds.delete(buildPromise)
      })
    }

    // 等待至少一个构建完成
    if (runningBuilds.size > 0) {
      await Promise.race(runningBuilds)
    }
  }

  const endTime = Date.now()
  const totalDuration = endTime - startTime

  // 生成构建报告
  console.log('\n📊 构建报告')
  console.log('='.repeat(50))

  const results = Array.from(buildStatus.results.values())
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)

  console.log(`📦 总项目数: ${buildStatus.total}`)
  console.log(`✅ 成功: ${successful.length}`)
  console.log(`❌ 失败: ${failed.length}`)
  console.log(`⏱️  总耗时: ${(totalDuration / 1000).toFixed(2)}s`)

  if (successful.length > 0) {
    console.log('\n✅ 成功项目:')
    successful.forEach((result) => {
      console.log(`   ${result.project}: ${(result.duration / 1000).toFixed(2)}s`)
    })
  }

  if (failed.length > 0) {
    console.log('\n❌ 失败项目:')
    failed.forEach((result) => {
      console.log(`   ${result.project}: ${result.output || 'Unknown error'}`)
    })
  }

  // 计算平均构建时间
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length
  console.log(`📈 平均构建时间: ${(avgDuration / 1000).toFixed(2)}s`)

  // 并行效率计算
  const sequentialTime = results.reduce((sum, r) => sum + r.duration, 0)
  const efficiency = ((sequentialTime - totalDuration) / sequentialTime * 100).toFixed(1)
  console.log(`⚡ 并行效率: ${efficiency}% (节省了 ${((sequentialTime - totalDuration) / 1000).toFixed(2)}s)`)

  return failed.length === 0
}

// 主执行逻辑
try {
  const success = await runParallelBuild()

  if (success) {
    console.log('\n🎉 所有项目构建成功！')
    process.exit(0)
  }
  else {
    console.log('\n💥 部分项目构建失败')
    process.exit(1)
  }
}
catch (error) {
  console.error('❌ 构建过程中发生错误:', error.message)
  process.exit(1)
}
