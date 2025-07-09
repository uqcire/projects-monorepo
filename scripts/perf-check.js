#!/usr/bin/env node

import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'

import chalk from 'chalk'

const CONFIG = {
  silent: false,
  baseline: './performance-baseline.json',
}

class QuickPerfCheck {
  constructor(config = {}) {
    this.config = { ...CONFIG, ...config }
    this.results = {}
    this.warnings = []
  }

  async check() {
    const start = Date.now()

    if (!this.config.silent) {
      process.stdout.write('⚡ ')
    }

    // 快速并行检查
    await Promise.all([
      this.checkBundleSize(),
      this.checkDependencies(),
      this.checkMemory(),
    ])

    if (!this.config.silent) {
      this.printQuickResults(Date.now() - start)
    }

    // 返回结果用于脚本集成
    return {
      success: this.warnings.length === 0,
      warnings: this.warnings,
      results: this.results,
    }
  }

  async checkBundleSize() {
    try {
      // 检查dist目录大小
      const distPaths = [
        'dist',
        'build',
        'packages/apps/*/dist',
        'packages/apps/*/build',
      ]

      let totalSize = 0
      let fileCount = 0

      for (const pattern of distPaths) {
        try {
          if (pattern.includes('*')) {
            // 简单的glob模拟
            const paths = this.simpleGlob(pattern)
            for (const path of paths) {
              const stats = this.getDirectorySize(path)
              totalSize += stats.size
              fileCount += stats.files
            }
          }
          else if (existsSync(pattern)) {
            const stats = this.getDirectorySize(pattern)
            totalSize += stats.size
            fileCount += stats.files
          }
        }
        catch {
          // 忽略不存在的目录
        }
      }

      this.results.bundle = { size: totalSize, files: fileCount }

      // 检查是否过大
      if (totalSize > 10 * 1024 * 1024) {
        this.warnings.push(`打包体积过大: ${this.formatBytes(totalSize)}`)
      }
    }
    catch (error) {
      this.results.bundle = { error: error.message }
    }
  }

  async checkDependencies() {
    try {
      // 快速检查package.json
      const pkgPath = 'package.json'
      if (!existsSync(pkgPath))
        return

      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      const deps = { ...pkg.dependencies, ...pkg.devDependencies }
      const depCount = Object.keys(deps).length

      this.results.dependencies = { count: depCount }

      // 快速检查是否有安全漏洞（仅检查是否存在）
      try {
        execSync('npm audit --audit-level high --dry-run', {
          stdio: 'pipe',
          timeout: 3000,
        })
      }
      catch (error) {
        if (error.status !== 0) {
          this.warnings.push('发现安全漏洞')
        }
      }

      // 检查依赖数量
      if (depCount > 200) {
        this.warnings.push(`依赖过多: ${depCount} 个`)
      }
    }
    catch (error) {
      this.results.dependencies = { error: error.message }
    }
  }

  async checkMemory() {
    try {
      const memUsage = process.memoryUsage()
      const heapUsed = memUsage.heapUsed / 1024 / 1024 // MB
      const heapTotal = memUsage.heapTotal / 1024 / 1024 // MB
      const usagePercent = (heapUsed / heapTotal) * 100

      this.results.memory = {
        used: heapUsed,
        total: heapTotal,
        percent: usagePercent,
      }

      if (usagePercent > 80) {
        this.warnings.push(`内存使用过高: ${usagePercent.toFixed(1)}%`)
      }
    }
    catch (error) {
      this.results.memory = { error: error.message }
    }
  }

  printQuickResults(executionTime) {
    // 状态指示器
    const status = this.warnings.length === 0
      ? chalk.green('✓')
      : chalk.yellow('⚠')

    // 核心指标
    const metrics = []

    if (this.results.bundle?.size) {
      const size = this.formatBytes(this.results.bundle.size, true)
      const color = this.results.bundle.size > 5 * 1024 * 1024 ? 'yellow' : 'gray'
      metrics.push(chalk[color](size))
    }

    if (this.results.dependencies?.count) {
      const count = this.results.dependencies.count
      const color = count > 150 ? 'yellow' : 'gray'
      metrics.push(chalk[color](`${count}deps`))
    }

    if (this.results.memory?.percent) {
      const percent = this.results.memory.percent.toFixed(0)
      const color = this.results.memory.percent > 70 ? 'yellow' : 'gray'
      metrics.push(chalk[color](`${percent}%mem`))
    }

    // 基线对比
    const baseline = this.getBaselineComparison()
    if (baseline) {
      metrics.push(baseline)
    }

    // 输出单行结果
    const metricsStr = metrics.length > 0 ? ` ${metrics.join(' ')}` : ''
    const timeStr = chalk.gray(`${executionTime}ms`)

    console.log(`${status}${metricsStr} ${timeStr}`)

    // 警告
    if (this.warnings.length > 0 && !this.config.silent) {
      this.warnings.forEach((warning) => {
        console.log(`  ${chalk.yellow('⚠')} ${warning}`)
      })
    }
  }

  getBaselineComparison() {
    try {
      if (!existsSync(this.config.baseline))
        return null

      const baseline = JSON.parse(readFileSync(this.config.baseline, 'utf-8'))

      if (this.results.bundle?.size && baseline.bundle?.analysis?.dist?.totalSize) {
        const current = this.results.bundle.size
        const base = baseline.bundle.analysis.dist.totalSize
        const diff = current - base
        const percent = ((diff / base) * 100)

        if (Math.abs(percent) > 10) { // 超过10%变化才显示
          const color = diff > 0 ? 'red' : 'green'
          const symbol = diff > 0 ? '↗' : '↘'
          return chalk[color](`${symbol}${Math.abs(percent).toFixed(0)}%`)
        }
      }
    }
    catch {
      // 忽略基线错误
    }
    return null
  }

  simpleGlob(pattern) {
    // 简单的glob实现，只处理 packages/apps/*/dist 这种情况
    if (pattern.includes('packages/apps/*/')) {
      const baseDir = 'packages/apps'
      if (!existsSync(baseDir))
        return []

      try {
        const apps = readFileSync('pnpm-workspace.yaml', 'utf-8')
          .split('\n')
          .find(line => line.includes('packages/apps'))
          ?.match(/packages\/apps\/\*/)?.[0]

        if (apps) {
          const suffix = pattern.replace('packages/apps/*/', '')
          // 简单扫描apps目录
          const appDirs = this.getSubDirectories(baseDir)
          return appDirs.map(dir => join(baseDir, dir, suffix))
            .filter(path => existsSync(path))
        }
      }
      catch {
        // 简单fallback
      }
    }
    return []
  }

  getSubDirectories(dir) {
    try {
      const { readdirSync } = require('node:fs')
      return readdirSync(dir)
        .filter(item => statSync(join(dir, item)).isDirectory())
    }
    catch {
      return []
    }
  }

  getDirectorySize(dirPath) {
    let totalSize = 0
    let fileCount = 0

    try {
      const { readdirSync } = require('node:fs')
      const items = readdirSync(dirPath)

      for (const item of items) {
        const itemPath = join(dirPath, item)
        const stats = statSync(itemPath)

        if (stats.isDirectory()) {
          const subStats = this.getDirectorySize(itemPath)
          totalSize += subStats.size
          fileCount += subStats.files
        }
        else {
          totalSize += stats.size
          fileCount++
        }
      }
    }
    catch {
      // 忽略权限错误等
    }

    return { size: totalSize, files: fileCount }
  }

  formatBytes(bytes, short = false) {
    if (bytes === 0)
      return short ? '0B' : '0 B'
    const k = 1024
    const sizes = short ? ['B', 'K', 'M', 'G'] : ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const size = Math.round((bytes / k ** i) * 10) / 10
    return short ? `${size}${sizes[i]}` : `${size} ${sizes[i]}`
  }

  /**
   * 自动生成性能报告并打开网页
   */
  async generateAndOpenReport() {
    try {
      if (!this.config.silent) {
        process.stdout.write(chalk.gray(' 📊'))
      }

      // 调用 performance-analyzer 生成报告
      const reportPath = resolve('performance-reports/performance-report.html')

      try {
        // 运行 performance-analyzer 生成报告
        execSync('node scripts/performance-analyzer.js report:all', {
          stdio: 'pipe',
          timeout: 15000, // 15秒超时
        })

        // 检查报告文件是否生成成功
        if (existsSync(reportPath)) {
          // 自动打开网页
          this.openInBrowser(reportPath)

          if (!this.config.silent) {
            console.log(chalk.gray(' 📊 已自动打开性能报告'))
          }
        }
      }
      catch {
        // 如果生成报告失败，静默处理，不影响主要功能
        if (!this.config.silent) {
          console.log(chalk.gray(' ⚠️ 报告生成失败'))
        }
      }
    }
    catch {
      // 静默处理错误，不影响主要的性能检查功能
    }
  }

  /**
   * 在浏览器中打开文件
   */
  openInBrowser(filePath) {
    const absolutePath = resolve(filePath)

    try {
      let command
      const platform = process.platform

      if (platform === 'win32') {
        // Windows
        command = `start "${absolutePath}"`
      }
      else if (platform === 'darwin') {
        // macOS
        command = `open "${absolutePath}"`
      }
      else {
        // Linux
        command = `xdg-open "${absolutePath}"`
      }

      // 使用 spawn 异步执行，避免阻塞
      if (platform === 'win32') {
        spawn('cmd', ['/c', 'start', '', absolutePath], {
          detached: true,
          stdio: 'ignore',
        }).unref()
      }
      else {
        const [cmd, ...args] = command.split(' ')
        spawn(cmd, args, {
          detached: true,
          stdio: 'ignore',
        }).unref()
      }
    }
    catch {
      // 静默处理浏览器打开失败的情况
    }
  }
}

// CLI
function parseArgs() {
  const args = process.argv.slice(2)
  const config = { ...CONFIG }

  for (const arg of args) {
    switch (arg) {
      case '--silent':
      case '-s':
        config.silent = true
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
  console.log(chalk.bold('超快性能检查'))
  console.log('')
  console.log('用法: node scripts/perf-check.js [选项]')
  console.log('')
  console.log('选项:')
  console.log('  -s, --silent    静默模式')
  console.log('  -h, --help      显示帮助')
  console.log('')
  console.log('示例:')
  console.log('  node scripts/perf-check.js')
  console.log('  node scripts/perf-check.js --silent')
}

// 主函数
async function main() {
  const config = parseArgs()
  const checker = new QuickPerfCheck(config)
  const result = await checker.check()

  // 自动生成性能报告并打开网页（除非是静默模式）
  if (!config.silent) {
    await checker.generateAndOpenReport()
  }

  // 设置退出代码
  process.exit(result.success ? 0 : 1)
}

// 仅在直接运行时执行
if (process.argv[1] && process.argv[1].includes('perf-check.js')) {
  main().catch(() => process.exit(1))
}

export default QuickPerfCheck
