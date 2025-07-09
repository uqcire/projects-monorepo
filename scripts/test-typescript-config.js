#!/usr/bin/env node

/**
 * TypeScript 配置系统测试脚本
 * 测试共享 TypeScript 配置的功能和集成
 */

import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
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
  typeChecking: {},
  summary: {},
}

console.log('🔧 TypeScript 配置系统测试')
console.log('='.repeat(50))

// 测试1: 检查 TypeScript 配置包
console.log('\n📦 1. 检查 TypeScript 配置包')
console.log('-'.repeat(30))

const configPackagePath = 'packages/typescript-config'
const configTests = [
  'package.json',
  'tsconfig.base.json',
  'tsconfig.vue.json',
  'tsconfig.node.json',
  'tsconfig.app.json',
  'index.js',
  'README.md',
]

for (const file of configTests) {
  const filePath = join(projectRoot, configPackagePath, file)
  const exists = existsSync(filePath)
  results.configPackage[file] = exists
  console.log(`${exists ? '✅' : '❌'} ${file}`)
}

// 测试2: 检查项目 TypeScript 配置
console.log('\n📋 2. 检查项目 TypeScript 配置')
console.log('-'.repeat(30))

for (const project of projects) {
  const projectName = project.split('/').pop()
  console.log(`\n🔍 ${projectName}:`)

  const projectPath = join(projectRoot, project)
  const tests = {
    'tsconfig.json': existsSync(join(projectPath, 'tsconfig.json')),
    'package.json 包含 @monorepo/typescript-config': false,
    'package.json 包含 typescript': false,
    'package.json 包含 vue-tsc': false,
  }

  // 检查 package.json 依赖
  try {
    const packageJsonPath = join(projectPath, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    const allDeps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    }

    tests['package.json 包含 @monorepo/typescript-config'] = '@monorepo/typescript-config' in allDeps
    tests['package.json 包含 typescript'] = 'typescript' in allDeps
    tests['package.json 包含 vue-tsc'] = 'vue-tsc' in allDeps
  }
  catch (error) {
    console.log(`   ❌ 无法读取 package.json: ${error.message}`)
  }

  results.projectConfigs[projectName] = tests

  for (const [test, passed] of Object.entries(tests)) {
    console.log(`   ${passed ? '✅' : '❌'} ${test}`)
  }
}

// 测试3: TypeScript 类型检查
console.log('\n🔍 3. TypeScript 类型检查测试')
console.log('-'.repeat(30))

for (const project of projects) {
  const projectName = project.split('/').pop()
  const projectPath = join(projectRoot, project)

  // 检查是否有 tsconfig.json
  if (!existsSync(join(projectPath, 'tsconfig.json'))) {
    results.typeChecking[projectName] = 'NO_CONFIG'
    console.log(`⏭️  ${projectName}: 跳过 (无 tsconfig.json)`)
    continue
  }

  try {
    console.log(`🔍 ${projectName}: 正在检查类型...`)

    // 运行 vue-tsc --noEmit
    execSync('pnpm vue-tsc --noEmit', {
      cwd: projectPath,
      stdio: 'pipe',
      timeout: 30000,
    })

    results.typeChecking[projectName] = 'PASSED'
    console.log(`✅ ${projectName}: 类型检查通过`)
  }
  catch (error) {
    results.typeChecking[projectName] = 'FAILED'
    console.log(`❌ ${projectName}: 类型检查失败`)

    // 显示错误详情 (截取前500字符)
    const errorOutput = error.stdout?.toString() || error.stderr?.toString() || ''
    if (errorOutput) {
      console.log(`   错误详情: ${errorOutput.slice(0, 500)}...`)
    }
  }
}

// 生成测试报告
console.log('\n📊 测试报告摘要')
console.log('='.repeat(50))

// 配置包统计
const configPackageSuccess = Object.values(results.configPackage).filter(Boolean).length
const configPackageTotal = Object.keys(results.configPackage).length
console.log(`📦 配置包文件: ${configPackageSuccess}/${configPackageTotal} (${Math.round(configPackageSuccess / configPackageTotal * 100)}%)`)

// 项目配置统计
let projectConfigSuccess = 0
let projectConfigTotal = 0
for (const tests of Object.values(results.projectConfigs)) {
  projectConfigSuccess += Object.values(tests).filter(Boolean).length
  projectConfigTotal += Object.keys(tests).length
}
console.log(`📋 项目配置: ${projectConfigSuccess}/${projectConfigTotal} (${Math.round(projectConfigSuccess / projectConfigTotal * 100)}%)`)

// 类型检查统计
const typeCheckPassed = Object.values(results.typeChecking).filter(v => v === 'PASSED').length
const typeCheckTotal = Object.values(results.typeChecking).filter(v => v !== 'NO_CONFIG').length
console.log(`🔍 类型检查: ${typeCheckPassed}/${typeCheckTotal} (${typeCheckTotal > 0 ? Math.round(typeCheckPassed / typeCheckTotal * 100) : 0}%)`)

// 整体状态
const overallSuccess = configPackageSuccess === configPackageTotal
  && projectConfigSuccess / projectConfigTotal >= 0.8
console.log(`\n🎯 整体状态: ${overallSuccess ? '✅ 成功' : '⚠️  需要改进'}`)

// 建议
console.log('\n💡 改进建议:')
if (configPackageSuccess < configPackageTotal) {
  console.log('- 完善 TypeScript 配置包文件')
}
if (projectConfigSuccess / projectConfigTotal < 1) {
  console.log('- 确保所有项目正确配置 TypeScript')
}
if (typeCheckPassed < typeCheckTotal) {
  console.log('- 修复 TypeScript 类型错误')
}

// 保存结果到文件
const reportData = {
  timestamp: new Date().toISOString(),
  results,
  summary: {
    configPackage: `${configPackageSuccess}/${configPackageTotal}`,
    projectConfigs: `${projectConfigSuccess}/${projectConfigTotal}`,
    typeChecking: `${typeCheckPassed}/${typeCheckTotal}`,
    overallSuccess,
  },
}

try {
  import('node:fs').then((fs) => {
    fs.writeFileSync(
      join(projectRoot, 'typescript-config-test-results.json'),
      JSON.stringify(reportData, null, 2),
    )
    console.log('\n📄 详细报告已保存到: typescript-config-test-results.json')
  })
}
catch {
  console.log('\n⚠️  无法保存测试报告文件')
}

process.exit(overallSuccess ? 0 : 1)
