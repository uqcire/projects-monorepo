#!/usr/bin/env node

/**
 * 清理构建产物和依赖的脚本
 * 支持选择性清理和完全重置
 */

import { execSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// 项目列表
const projects = [
  'packages/apps/dflm',
  'packages/apps/basketball-score',
  'packages/apps/cirq',
  'packages/apps/gcn-website',
  'packages/apps/site-template',
]

// 需要清理的构建目录
const buildDirs = [
  'dist',
  'build',
  '.output',
  '.nuxt',
  '.next',
  'coverage',
  'test-results',
  'test-results.json',
  'test-results.html',
  'vitest-config-test-results.json',
  'typescript-config-test-results.json',
  'styles-system-test-results.json',
  'tailwind-themes-test-results.json',
]

// 需要清理的依赖目录
const depsDirs = [
  'node_modules',
  'pnpm-lock.yaml',
  '.pnpm',
  '.pnpm-store',
]

// 需要清理的缓存目录
const cacheDirs = [
  '.vite',
  '.turbo',
  '.cache',
  '.temp',
  '.tmp',
  'tsconfig.tsbuildinfo',
  '.eslintcache',
  '.stylelintcache',
]

// 解析命令行参数
const args = process.argv.slice(2)
const options = {
  buildOnly: args.includes('--build-only'),
  depsOnly: args.includes('--deps-only'),
  cacheOnly: args.includes('--cache-only'),
  all: args.includes('--all'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  dryRun: args.includes('--dry-run'),
}

// 如果没有指定选项，默认清理构建产物
if (!options.buildOnly && !options.depsOnly && !options.cacheOnly && !options.all) {
  options.buildOnly = true
}

console.log('🧹 构建清理脚本')
console.log('='.repeat(50))

/**
 * 安全删除文件或目录
 * @param {string} path - 要删除的路径
 * @param {string} type - 类型描述
 */
function safeRemove(path, type = 'file') {
  if (existsSync(path)) {
    if (options.dryRun) {
      console.log(`🔍 [DRY RUN] 将删除 ${type}: ${path}`)
      return
    }

    try {
      rmSync(path, { recursive: true, force: true })
      if (options.verbose) {
        console.log(`✅ 已删除 ${type}: ${path}`)
      }
      return true
    }
    catch (error) {
      console.error(`❌ 删除失败 ${type}: ${path}`, error.message)
      return false
    }
  }
  return false
}

/**
 * 清理构建产物
 */
function cleanBuildArtifacts() {
  console.log('\n📦 清理构建产物...')

  let cleaned = 0

  // 清理根目录的构建产物
  for (const dir of buildDirs) {
    const path = join(projectRoot, dir)
    if (safeRemove(path, '构建产物')) {
      cleaned++
    }
  }

  // 清理各个项目的构建产物
  for (const project of projects) {
    const projectPath = join(projectRoot, project)

    for (const dir of buildDirs) {
      const path = join(projectPath, dir)
      if (safeRemove(path, '构建产物')) {
        cleaned++
      }
    }
  }

  console.log(`✅ 构建产物清理完成 (清理了 ${cleaned} 个目录/文件)`)
}

/**
 * 清理依赖
 */
function cleanDependencies() {
  console.log('\n📚 清理依赖...')

  let cleaned = 0

  // 清理根目录的依赖
  for (const dir of depsDirs) {
    const path = join(projectRoot, dir)
    if (safeRemove(path, '依赖目录')) {
      cleaned++
    }
  }

  // 清理各个项目的依赖
  for (const project of projects) {
    const projectPath = join(projectRoot, project)

    for (const dir of depsDirs) {
      const path = join(projectPath, dir)
      if (safeRemove(path, '依赖目录')) {
        cleaned++
      }
    }
  }

  // 清理共享包的依赖
  const sharedPackages = [
    'packages/styles',
    'packages/tailwind-config',
    'packages/typescript-config',
    'packages/vitest-config',
    'packages/dependency-versions',
  ]

  for (const pkg of sharedPackages) {
    const packagePath = join(projectRoot, pkg)

    for (const dir of depsDirs) {
      const path = join(packagePath, dir)
      if (safeRemove(path, '依赖目录')) {
        cleaned++
      }
    }
  }

  console.log(`✅ 依赖清理完成 (清理了 ${cleaned} 个目录/文件)`)
}

/**
 * 清理缓存
 */
function cleanCache() {
  console.log('\n💾 清理缓存...')

  let cleaned = 0

  // 清理根目录的缓存
  for (const dir of cacheDirs) {
    const path = join(projectRoot, dir)
    if (safeRemove(path, '缓存目录')) {
      cleaned++
    }
  }

  // 清理各个项目的缓存
  for (const project of projects) {
    const projectPath = join(projectRoot, project)

    for (const dir of cacheDirs) {
      const path = join(projectPath, dir)
      if (safeRemove(path, '缓存目录')) {
        cleaned++
      }
    }
  }

  // 清理 pnpm 全局缓存
  if (!options.dryRun) {
    try {
      console.log('🔄 清理 pnpm 全局缓存...')
      execSync('pnpm store prune', { stdio: 'inherit' })
      console.log('✅ pnpm 全局缓存清理完成')
    }
    catch (error) {
      console.error('❌ pnpm 缓存清理失败:', error.message)
    }
  }

  console.log(`✅ 缓存清理完成 (清理了 ${cleaned} 个目录/文件)`)
}

/**
 * 重新安装依赖
 */
function reinstallDependencies() {
  if (options.dryRun) {
    console.log('🔍 [DRY RUN] 将重新安装依赖')
    return
  }

  console.log('\n📦 重新安装依赖...')

  try {
    execSync('pnpm install', {
      stdio: 'inherit',
      cwd: projectRoot,
    })
    console.log('✅ 依赖安装完成')
  }
  catch (error) {
    console.error('❌ 依赖安装失败:', error.message)
    process.exit(1)
  }
}

// 主执行逻辑
try {
  if (options.dryRun) {
    console.log('🔍 DRY RUN 模式 - 不会实际删除文件')
  }

  const startTime = Date.now()

  if (options.buildOnly || options.all) {
    cleanBuildArtifacts()
  }

  if (options.cacheOnly || options.all) {
    cleanCache()
  }

  if (options.depsOnly || options.all) {
    cleanDependencies()

    // 如果清理了依赖，询问是否重新安装
    if (!options.dryRun) {
      console.log('\n❓ 是否重新安装依赖？')
      console.log('   运行: pnpm install')

      // 在 CI 环境中自动重新安装
      if (process.env.CI) {
        reinstallDependencies()
      }
    }
  }

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  console.log(`\n🎉 清理完成！耗时 ${duration} 秒`)

  if (options.dryRun) {
    console.log('\n💡 要实际执行清理，请移除 --dry-run 参数')
  }
}
catch (error) {
  console.error('❌ 清理过程中发生错误:', error.message)
  process.exit(1)
}
