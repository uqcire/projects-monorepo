#!/usr/bin/env node

/**
 * 构建脚本测试和验证系统
 * 验证所有构建脚本的功能和完整性
 */

import { spawn } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// 测试配置
const testConfig = {
  timeout: 60000, // 60秒超时
  maxRetries: 2,
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
  dryRun: process.argv.includes('--dry-run'),
}

// 项目配置
const projects = [
  {
    name: 'dflm',
    path: 'packages/apps/dflm',
    packageName: 'dflm-website',
  },
  {
    name: 'basketball-score',
    path: 'packages/apps/basketball-score',
    packageName: 'project--basketball-stats-app',
  },
  {
    name: 'cirq',
    path: 'packages/apps/cirq',
    packageName: 'Cirq',
  },
  {
    name: 'gcn-website',
    path: 'packages/apps/gcn-website',
    packageName: 'gcn-website',
  },
  {
    name: 'site-template',
    path: 'packages/apps/site-template',
    packageName: 'project-development-environment--daysi-ui',
  },
]

// 需要测试的脚本
const scriptsToTest = [
  {
    name: '清理脚本',
    script: 'clean-build.js',
    args: ['--dry-run'],
    expectedOutput: ['构建清理脚本', 'DRY RUN'],
  },
  {
    name: '并行构建脚本',
    script: 'parallel-build.js',
    args: ['build', '--dry-run'],
    expectedOutput: ['并行构建脚本', 'DRY RUN'],
  },
  {
    name: '环境管理脚本',
    script: 'env-manager.js',
    args: ['list'],
    expectedOutput: ['环境管理脚本', '可用环境'],
  },
]

// 需要测试的 package.json 脚本
const packageScripts = [
  'build:test',
  'clean',
  'env:list',
  'deps:check',
]

console.log('🧪 构建脚本测试系统')
console.log('='.repeat(50))

/**
 * 运行命令并返回结果
 * @param {string} command - 命令
 * @param {Array} args - 参数
 * @param {object} options - 选项
 * @returns {Promise<object>} 执行结果
 */
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve) => {
    const startTime = Date.now()

    if (testConfig.dryRun) {
      console.log(`🔍 [DRY RUN] ${command} ${args.join(' ')}`)
      resolve({
        success: true,
        duration: 100,
        output: '[DRY RUN] 模拟执行成功',
        command: `${command} ${args.join(' ')}`,
      })
      return
    }

    const child = spawn(command, args, {
      cwd: options.cwd || projectRoot,
      stdio: 'pipe',
      shell: true,
    })

    let output = ''
    let errorOutput = ''

    child.stdout?.on('data', (data) => {
      output += data.toString()
    })

    child.stderr?.on('data', (data) => {
      errorOutput += data.toString()
    })

    const timer = setTimeout(() => {
      child.kill('SIGTERM')
      resolve({
        success: false,
        duration: Date.now() - startTime,
        output: '命令执行超时',
        command: `${command} ${args.join(' ')}`,
        timeout: true,
      })
    }, testConfig.timeout)

    child.on('close', (code) => {
      clearTimeout(timer)
      const duration = Date.now() - startTime

      resolve({
        success: code === 0,
        duration,
        output: output || errorOutput,
        command: `${command} ${args.join(' ')}`,
        exitCode: code,
      })
    })

    child.on('error', (error) => {
      clearTimeout(timer)
      resolve({
        success: false,
        duration: Date.now() - startTime,
        output: error.message,
        command: `${command} ${args.join(' ')}`,
        error,
      })
    })
  })
}

/**
 * 测试单个脚本
 * @param {object} scriptConfig - 脚本配置
 * @returns {Promise<object>} 测试结果
 */
async function testScript(scriptConfig) {
  console.log(`\n🔧 测试: ${scriptConfig.name}`)
  console.log('-'.repeat(30))

  const scriptPath = join(projectRoot, 'scripts', scriptConfig.script)

  // 检查脚本文件是否存在
  if (!existsSync(scriptPath)) {
    return {
      name: scriptConfig.name,
      success: false,
      error: `脚本文件不存在: ${scriptPath}`,
    }
  }

  let attempts = 0
  let result

  while (attempts <= testConfig.maxRetries) {
    attempts++

    console.log(`📋 执行 (尝试 ${attempts}/${testConfig.maxRetries + 1}): node ${scriptConfig.script} ${scriptConfig.args.join(' ')}`)

    result = await runCommand('node', [scriptPath, ...scriptConfig.args])

    if (result.success) {
      break
    }

    if (attempts <= testConfig.maxRetries) {
      console.log(`⚠️  执行失败，${2000}ms 后重试...`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  // 检查输出是否包含预期内容
  let outputValid = true
  const missingOutputs = []

  for (const expected of scriptConfig.expectedOutput) {
    if (!result.output.includes(expected)) {
      outputValid = false
      missingOutputs.push(expected)
    }
  }

  const testResult = {
    name: scriptConfig.name,
    success: result.success && outputValid,
    duration: result.duration,
    attempts,
    output: result.output,
    command: result.command,
    missingOutputs,
  }

  if (testResult.success) {
    console.log(`✅ 测试通过 (${testResult.duration}ms)`)
  }
  else {
    console.log(`❌ 测试失败`)
    if (!result.success) {
      console.log(`   执行失败: ${result.output}`)
    }
    if (missingOutputs.length > 0) {
      console.log(`   缺少预期输出: ${missingOutputs.join(', ')}`)
    }
  }

  if (testConfig.verbose) {
    console.log(`📝 输出预览:\n${result.output.slice(0, 300)}...`)
  }

  return testResult
}

/**
 * 测试 package.json 脚本
 * @param {string} scriptName - 脚本名称
 * @returns {Promise<object>} 测试结果
 */
async function testPackageScript(scriptName) {
  console.log(`\n📦 测试 package.json 脚本: ${scriptName}`)
  console.log('-'.repeat(30))

  // 检查脚本是否存在
  const packageJsonPath = join(projectRoot, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

  if (!packageJson.scripts[scriptName]) {
    return {
      name: scriptName,
      success: false,
      error: `脚本不存在: ${scriptName}`,
    }
  }

  console.log(`📋 执行: pnpm run ${scriptName}`)

  const result = await runCommand('pnpm', ['run', scriptName])

  const testResult = {
    name: scriptName,
    success: result.success,
    duration: result.duration,
    output: result.output,
    command: result.command,
  }

  if (testResult.success) {
    console.log(`✅ 脚本执行成功 (${testResult.duration}ms)`)
  }
  else {
    console.log(`❌ 脚本执行失败`)
    console.log(`   错误: ${result.output}`)
  }

  if (testConfig.verbose) {
    console.log(`📝 输出预览:\n${result.output.slice(0, 300)}...`)
  }

  return testResult
}

/**
 * 测试项目构建脚本
 * @param {object} project - 项目配置
 * @returns {Promise<object>} 测试结果
 */
async function testProjectBuild(project) {
  console.log(`\n🏗️  测试项目构建: ${project.name}`)
  console.log('-'.repeat(30))

  const projectPath = join(projectRoot, project.path)

  if (!existsSync(projectPath)) {
    return {
      name: project.name,
      success: false,
      error: `项目路径不存在: ${projectPath}`,
    }
  }

  // 检查 package.json
  const packageJsonPath = join(projectPath, 'package.json')
  if (!existsSync(packageJsonPath)) {
    return {
      name: project.name,
      success: false,
      error: 'package.json 不存在',
    }
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

  // 检查必需的脚本
  const requiredScripts = ['build', 'dev', 'lint', 'test']
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script])

  if (missingScripts.length > 0) {
    return {
      name: project.name,
      success: false,
      error: `缺少必需脚本: ${missingScripts.join(', ')}`,
    }
  }

  // 测试类型检查（如果有）
  let typeCheckResult = { success: true }
  if (packageJson.scripts['type-check']) {
    console.log(`📋 执行类型检查: ${project.name}`)
    typeCheckResult = await runCommand('pnpm', ['run', 'type-check'], { cwd: projectPath })
  }

  return {
    name: project.name,
    success: typeCheckResult.success,
    duration: typeCheckResult.duration,
    output: typeCheckResult.output,
    hasTypeCheck: !!packageJson.scripts['type-check'],
  }
}

/**
 * 验证脚本依赖
 * @returns {object} 验证结果
 */
function validateScriptDependencies() {
  console.log('\n🔍 验证脚本依赖')
  console.log('-'.repeat(30))

  const results = {
    success: true,
    issues: [],
  }

  // 检查必需的脚本文件
  const requiredScripts = [
    'scripts/clean-build.js',
    'scripts/parallel-build.js',
    'scripts/env-manager.js',
    'scripts/test-build-scripts.js',
  ]

  for (const scriptPath of requiredScripts) {
    const fullPath = join(projectRoot, scriptPath)
    if (!existsSync(fullPath)) {
      results.success = false
      results.issues.push(`缺少脚本文件: ${scriptPath}`)
    }
    else {
      console.log(`✅ 脚本文件存在: ${scriptPath}`)
    }
  }

  // 检查 package.json 中的脚本
  const packageJsonPath = join(projectRoot, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

  const requiredPackageScripts = [
    'build',
    'build:parallel',
    'clean',
    'env:list',
    'deps:check',
  ]

  for (const scriptName of requiredPackageScripts) {
    if (!packageJson.scripts[scriptName]) {
      results.success = false
      results.issues.push(`缺少 package.json 脚本: ${scriptName}`)
    }
    else {
      console.log(`✅ package.json 脚本存在: ${scriptName}`)
    }
  }

  // 检查依赖
  const requiredDeps = ['cross-env']
  const devDeps = packageJson.devDependencies || {}

  for (const dep of requiredDeps) {
    if (!devDeps[dep]) {
      results.success = false
      results.issues.push(`缺少依赖: ${dep}`)
    }
    else {
      console.log(`✅ 依赖存在: ${dep}`)
    }
  }

  return results
}

/**
 * 生成测试报告
 * @param {Array} results - 测试结果
 */
function generateReport(results) {
  console.log('\n📊 构建脚本测试报告')
  console.log('='.repeat(50))

  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)

  console.log(`📦 总测试数: ${results.length}`)
  console.log(`✅ 成功: ${successful.length}`)
  console.log(`❌ 失败: ${failed.length}`)

  if (successful.length > 0) {
    console.log('\n✅ 成功测试:')
    successful.forEach((result) => {
      const duration = result.duration ? ` (${result.duration}ms)` : ''
      console.log(`   ${result.name}${duration}`)
    })
  }

  if (failed.length > 0) {
    console.log('\n❌ 失败测试:')
    failed.forEach((result) => {
      console.log(`   ${result.name}: ${result.error || '执行失败'}`)
    })
  }

  // 计算平均执行时间
  const withDuration = results.filter(r => r.duration)
  if (withDuration.length > 0) {
    const avgDuration = withDuration.reduce((sum, r) => sum + r.duration, 0) / withDuration.length
    console.log(`📈 平均执行时间: ${avgDuration.toFixed(2)}ms`)
  }

  // 生成 JSON 报告
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      successRate: `${((successful.length / results.length) * 100).toFixed(1)}%`,
    },
    results,
  }

  const reportPath = join(projectRoot, 'build-scripts-test-results.json')
  writeFileSync(reportPath, JSON.stringify(reportData, null, 2))
  console.log(`\n📄 详细报告已保存到: ${reportPath}`)

  return failed.length === 0
}

// 主执行逻辑
async function runTests() {
  try {
    const results = []

    // 验证脚本依赖
    const dependencyCheck = validateScriptDependencies()
    if (!dependencyCheck.success) {
      console.log('\n❌ 脚本依赖验证失败:')
      dependencyCheck.issues.forEach(issue => console.log(`   ${issue}`))
      process.exit(1)
    }

    // 测试独立脚本
    console.log('\n🔧 测试独立脚本')
    console.log('='.repeat(30))

    for (const scriptConfig of scriptsToTest) {
      const result = await testScript(scriptConfig)
      results.push(result)
    }

    // 测试 package.json 脚本
    console.log('\n📦 测试 package.json 脚本')
    console.log('='.repeat(30))

    for (const scriptName of packageScripts) {
      const result = await testPackageScript(scriptName)
      results.push(result)
    }

    // 测试项目构建脚本
    console.log('\n🏗️  测试项目构建脚本')
    console.log('='.repeat(30))

    for (const project of projects) {
      const result = await testProjectBuild(project)
      results.push(result)
    }

    // 生成报告
    const success = generateReport(results)

    if (success) {
      console.log('\n🎉 所有构建脚本测试通过！')
      process.exit(0)
    }
    else {
      console.log('\n💥 部分构建脚本测试失败')
      process.exit(1)
    }
  }
  catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
}
