#!/usr/bin/env node

/**
 * Vitest 配置系统测试脚本
 * 测试共享测试配置的功能和集成
 */

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
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

// 测试结果
const results = {
  configPackage: {},
  projectConfigs: {},
  testExecution: {},
  coverage: {},
  summary: {},
}

console.log('🧪 Vitest 配置系统测试')
console.log('='.repeat(50))

// 测试1: 检查配置包完整性
console.log('\n📦 1. 检查 Vitest 配置包')

const configPackagePath = 'packages/vitest-config'
const configTests = [
  'package.json',
  'vitest.config.base.js',
  'vitest.config.vue.js',
  'vitest.config.node.js',
  'index.js',
  'README.md',
]

for (const file of configTests) {
  const filePath = join(projectRoot, configPackagePath, file)
  const exists = existsSync(filePath)
  results.configPackage[file] = exists
  console.log(`${exists ? '✅' : '❌'} ${file}`)
}

// 测试2: 检查项目测试配置
console.log('\n📋 2. 检查项目测试配置')

for (const project of projects) {
  const projectName = project.split('/').pop()
  console.log(`\n🔍 ${projectName}:`)

  const projectPath = join(projectRoot, project)
  const tests = {
    'vitest.config.js': existsSync(join(projectPath, 'vitest.config.js')),
    'package.json 包含 @monorepo/vitest-config': false,
    'package.json 包含 vitest': false,
    'package.json 包含测试脚本': false,
  }

  // 检查 package.json 配置
  try {
    const packageJsonPath = join(projectPath, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    const allDeps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    }

    tests['package.json 包含 @monorepo/vitest-config'] = '@monorepo/vitest-config' in allDeps
    tests['package.json 包含 vitest'] = 'vitest' in allDeps
    tests['package.json 包含测试脚本'] = !!(packageJson.scripts?.test || packageJson.scripts?.['test:run'])
  }
  catch (error) {
    console.log(`   ❌ 无法读取 package.json: ${error.message}`)
  }

  results.projectConfigs[projectName] = tests

  for (const [test, passed] of Object.entries(tests)) {
    console.log(`   ${passed ? '✅' : '❌'} ${test}`)
  }
}

// 测试3: 执行测试运行
console.log('\n🔍 3. 执行测试运行')

for (const project of projects) {
  const projectName = project.split('/').pop()
  const projectPath = join(projectRoot, project)

  // 检查是否有 vitest.config.js
  if (!existsSync(join(projectPath, 'vitest.config.js'))) {
    results.testExecution[projectName] = 'NO_CONFIG'
    console.log(`⏭️  ${projectName}: 跳过 (无 vitest.config.js)`)
    continue
  }

  try {
    console.log(`🧪 ${projectName}: 正在运行测试...`)

    // 运行测试 (dry run)
    execSync('pnpm vitest run --reporter=json --no-coverage', {
      cwd: projectPath,
      stdio: 'pipe',
      timeout: 30000,
    })

    results.testExecution[projectName] = 'PASSED'
    console.log(`✅ ${projectName}: 测试配置正常`)
  }
  catch (error) {
    results.testExecution[projectName] = 'FAILED'
    console.log(`❌ ${projectName}: 测试配置失败`)

    // 显示错误详情
    const errorOutput = error.stdout?.toString() || error.stderr?.toString() || ''
    if (errorOutput) {
      console.log(`   错误详情: ${errorOutput.slice(0, 300)}...`)
    }
  }
}

// 测试4: 覆盖率配置测试
console.log('\n📊 4. 覆盖率配置测试')

for (const project of projects) {
  const projectName = project.split('/').pop()
  const projectPath = join(projectRoot, project)

  if (!existsSync(join(projectPath, 'vitest.config.js'))) {
    results.coverage[projectName] = 'NO_CONFIG'
    console.log(`⏭️  ${projectName}: 跳过覆盖率测试`)
    continue
  }

  try {
    console.log(`📊 ${projectName}: 检查覆盖率配置...`)

    // 检查覆盖率配置 (dry run)
    execSync('pnpm vitest run --coverage --reporter=json', {
      cwd: projectPath,
      stdio: 'pipe',
      timeout: 30000,
    })

    results.coverage[projectName] = 'PASSED'
    console.log(`✅ ${projectName}: 覆盖率配置正常`)
  }
  catch (error) {
    results.coverage[projectName] = 'FAILED'
    console.log(`❌ ${projectName}: 覆盖率配置失败`)
  }
}

// 生成测试报告
console.log('\n📊 测试报告摘要')
console.log('='.repeat(50))

const configPackageTotal = Object.keys(results.configPackage).length
const configPackageSuccess = Object.values(results.configPackage).filter(Boolean).length

const projectConfigTotal = projects.length * 4 // 每个项目4个测试项
const projectConfigSuccess = Object.values(results.projectConfigs)
  .flatMap(tests => Object.values(tests))
  .filter(Boolean)
  .length

const testExecutionTotal = projects.length
const testExecutionPassed = Object.values(results.testExecution)
  .filter(status => status === 'PASSED')
  .length

const coverageTotal = projects.length
const coveragePassed = Object.values(results.coverage)
  .filter(status => status === 'PASSED')
  .length

console.log(`📦 配置包完整性: ${configPackageSuccess}/${configPackageTotal}`)
console.log(`📋 项目配置: ${projectConfigSuccess}/${projectConfigTotal}`)
console.log(`🧪 测试执行: ${testExecutionPassed}/${testExecutionTotal}`)
console.log(`📊 覆盖率配置: ${coveragePassed}/${coverageTotal}`)

const overallSuccess = (
  configPackageSuccess === configPackageTotal
  && projectConfigSuccess >= projectConfigTotal * 0.8
  && testExecutionPassed >= testExecutionTotal * 0.6
  && coveragePassed >= coverageTotal * 0.6
)

console.log(`\n🎯 总体状态: ${overallSuccess ? '✅ 成功' : '❌ 需要改进'}`)

if (!overallSuccess) {
  console.log('\n🔧 建议改进:')
  if (configPackageSuccess < configPackageTotal) {
    console.log('- 完善 Vitest 配置包文件')
  }
  if (projectConfigSuccess / projectConfigTotal < 0.8) {
    console.log('- 确保所有项目正确配置测试')
  }
  if (testExecutionPassed < testExecutionTotal * 0.6) {
    console.log('- 修复测试配置错误')
  }
  if (coveragePassed < coverageTotal * 0.6) {
    console.log('- 修复覆盖率配置问题')
  }
}

// 保存结果到文件
const reportData = {
  timestamp: new Date().toISOString(),
  results,
  summary: {
    configPackage: `${configPackageSuccess}/${configPackageTotal}`,
    projectConfigs: `${projectConfigSuccess}/${projectConfigTotal}`,
    testExecution: `${testExecutionPassed}/${testExecutionTotal}`,
    coverage: `${coveragePassed}/${coverageTotal}`,
    overallSuccess,
  },
}

try {
  writeFileSync(
    join(projectRoot, 'vitest-config-test-results.json'),
    JSON.stringify(reportData, null, 2),
  )
  console.log('\n📄 详细报告已保存到: vitest-config-test-results.json')
}
catch {
  console.log('\n⚠️  无法保存测试报告文件')
}

process.exit(overallSuccess ? 0 : 1)
