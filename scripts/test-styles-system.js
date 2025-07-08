#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// 项目配置
const projects = [
  {
    name: 'Basketball Score',
    path: 'packages/apps/basketball-score',
    theme: 'basketball',
    expectedStyles: ['@monorepo/styles/base', 'basketball', 'stat-card'],
  },
  {
    name: 'Cirq',
    path: 'packages/apps/cirq',
    theme: 'cirq',
    expectedStyles: ['@monorepo/styles/base', 'cirq', 'contact-card'],
  },
  {
    name: 'DFLM Website',
    path: 'packages/apps/dflm',
    theme: 'dflm',
    expectedStyles: ['@monorepo/styles/base', 'dflm', 'brand-heading'],
  },
  {
    name: 'Site Template',
    path: 'packages/apps/site-template',
    theme: 'light',
    expectedStyles: ['@monorepo/styles/base', 'theme-selector', 'demo-card'],
  },
  {
    name: 'GCN Website',
    path: 'packages/apps/gcn-website',
    theme: 'gcn',
    expectedStyles: ['@monorepo/styles/base', 'corporate-card', 'service-feature'],
  },
]

// 颜色输出函数
const colors = {
  reset: '\x1B[0m',
  bright: '\x1B[1m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
}

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`
}

function log(message, color = 'reset') {
  console.log(colorize(message, color))
}

function logSection(title) {
  console.log(`\n${colorize('='.repeat(60), 'cyan')}`)
  console.log(colorize(`  ${title}`, 'cyan'))
  console.log(colorize('='.repeat(60), 'cyan'))
}

function logSubSection(title) {
  console.log(`\n${colorize(`📋 ${title}`, 'yellow')}`)
  console.log(colorize('-'.repeat(40), 'yellow'))
}

// 测试结果收集
const testResults = {
  packagesInstalled: false,
  stylesPackageExists: false,
  projectTests: [],
  buildTests: [],
  overallSuccess: false,
}

// 1. 检查共享样式包是否存在
function checkStylesPackage() {
  logSubSection('检查共享样式包')

  const stylesPackagePath = join(projectRoot, 'packages/styles/package.json')
  const stylesIndexPath = join(projectRoot, 'packages/styles/index.js')

  if (existsSync(stylesPackagePath) && existsSync(stylesIndexPath)) {
    const packageJson = JSON.parse(readFileSync(stylesPackagePath, 'utf8'))
    log(`✅ 样式包存在: ${packageJson.name}@${packageJson.version}`, 'green')

    const indexContent = readFileSync(stylesIndexPath, 'utf8')
    const hasThemes = indexContent.includes('themes')
    const hasComponents = indexContent.includes('components')

    log(`✅ 主题配置: ${hasThemes ? '存在' : '缺失'}`, hasThemes ? 'green' : 'red')
    log(`✅ 组件样式: ${hasComponents ? '存在' : '缺失'}`, hasComponents ? 'green' : 'red')

    testResults.stylesPackageExists = true
    return true
  }
  else {
    log('❌ 共享样式包不存在', 'red')
    return false
  }
}

// 2. 检查依赖安装
function checkDependencies() {
  logSubSection('检查依赖安装状态')

  try {
    // 检查 node_modules 是否存在
    const nodeModulesPath = join(projectRoot, 'node_modules')
    if (!existsSync(nodeModulesPath)) {
      log('❌ node_modules 不存在，请运行 pnpm install', 'red')
      return false
    }

    // 检查共享样式包是否被链接
    const stylesLinkPath = join(projectRoot, 'node_modules/@monorepo/styles')
    if (existsSync(stylesLinkPath)) {
      log('✅ @monorepo/styles 包已正确链接', 'green')
      testResults.packagesInstalled = true
      return true
    }
    else {
      log('❌ @monorepo/styles 包未正确链接', 'red')
      return false
    }
  }
  catch (error) {
    log(`❌ 依赖检查失败: ${error.message}`, 'red')
    return false
  }
}

// 3. 检查各项目的样式配置
function checkProjectStyles() {
  logSubSection('检查各项目样式配置')

  for (const project of projects) {
    const projectPath = join(projectRoot, project.path)
    const globalStylesPath = join(projectPath, 'src/styles/global.css')
    const packageJsonPath = join(projectPath, 'package.json')

    log(`\n🔍 检查项目: ${project.name}`, 'blue')

    const result = {
      name: project.name,
      hasGlobalStyles: false,
      hasDependency: false,
      hasExpectedStyles: false,
      stylesFound: [],
    }

    // 检查 package.json 依赖
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      const hasDep = packageJson.dependencies && packageJson.dependencies['@monorepo/styles']
      result.hasDependency = hasDep
      log(`  📦 依赖配置: ${hasDep ? '✅' : '❌'}`, hasDep ? 'green' : 'red')
    }

    // 检查全局样式文件
    if (existsSync(globalStylesPath)) {
      result.hasGlobalStyles = true
      const styleContent = readFileSync(globalStylesPath, 'utf8')

      // 检查是否包含预期的样式导入和类
      project.expectedStyles.forEach((style) => {
        if (styleContent.includes(style)) {
          result.stylesFound.push(style)
        }
      })

      result.hasExpectedStyles = result.stylesFound.length >= 2 // 至少要有基础导入和一个特定样式

      log(`  🎨 全局样式: ✅`, 'green')
      log(`  🎯 预期样式: ${result.stylesFound.length}/${project.expectedStyles.length} 找到`, result.hasExpectedStyles ? 'green' : 'yellow')

      if (result.stylesFound.length > 0) {
        log(`     找到: ${result.stylesFound.join(', ')}`, 'cyan')
      }
    }
    else {
      log(`  🎨 全局样式: ❌ 文件不存在`, 'red')
    }

    testResults.projectTests.push(result)
  }
}

// 4. 测试构建功能
function testBuilds() {
  logSubSection('测试项目构建')

  for (const project of projects) {
    log(`\n🔨 构建项目: ${project.name}`, 'blue')

    const result = {
      name: project.name,
      buildSuccess: false,
      buildTime: 0,
      outputSize: 0,
      errors: [],
    }

    try {
      const startTime = Date.now()
      const buildCommand = `pnpm --filter "./${project.path}" build`

      execSync(buildCommand, {
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 60000, // 60秒超时
      })

      result.buildTime = Date.now() - startTime
      result.buildSuccess = true

      log(`  ✅ 构建成功 (${result.buildTime}ms)`, 'green')

      // 检查输出文件
      const distPath = join(projectRoot, project.path, 'dist')
      if (existsSync(distPath)) {
        const cssFiles = execSync(`find "${distPath}" -name "*.css" | wc -l`, {
          encoding: 'utf8',
          cwd: projectRoot,
        }).trim()
        log(`  📄 CSS 文件数量: ${cssFiles}`, 'cyan')
      }
    }
    catch (error) {
      result.buildSuccess = false
      result.errors.push(error.message)
      log(`  ❌ 构建失败: ${error.message.substring(0, 100)}...`, 'red')
    }

    testResults.buildTests.push(result)
  }
}

// 5. 生成测试报告
function generateReport() {
  logSection('📊 测试报告')

  const totalProjects = projects.length
  const successfulBuilds = testResults.buildTests.filter(t => t.buildSuccess).length
  const projectsWithDeps = testResults.projectTests.filter(t => t.hasDependency).length
  const projectsWithStyles = testResults.projectTests.filter(t => t.hasExpectedStyles).length

  log(`\n📈 总体统计:`, 'bright')
  log(`  🏗️  成功构建: ${successfulBuilds}/${totalProjects} (${Math.round(successfulBuilds / totalProjects * 100)}%)`, successfulBuilds === totalProjects ? 'green' : 'yellow')
  log(`  📦 依赖配置: ${projectsWithDeps}/${totalProjects} (${Math.round(projectsWithDeps / totalProjects * 100)}%)`, projectsWithDeps === totalProjects ? 'green' : 'yellow')
  log(`  🎨 样式集成: ${projectsWithStyles}/${totalProjects} (${Math.round(projectsWithStyles / totalProjects * 100)}%)`, projectsWithStyles >= totalProjects * 0.8 ? 'green' : 'yellow')
  log(`  📋 共享包状态: ${testResults.stylesPackageExists ? '✅ 正常' : '❌ 异常'}`, testResults.stylesPackageExists ? 'green' : 'red')

  // 详细项目报告
  log(`\n📋 详细项目报告:`, 'bright')
  testResults.projectTests.forEach((project, index) => {
    const build = testResults.buildTests[index]
    const status = build?.buildSuccess ? '✅' : '❌'
    log(`  ${status} ${project.name}: 依赖${project.hasDependency ? '✅' : '❌'} 样式${project.hasExpectedStyles ? '✅' : '❌'} 构建${build?.buildSuccess ? '✅' : '❌'}`, build?.buildSuccess ? 'green' : 'red')
  })

  // 总体评估
  const overallScore = (
    (testResults.stylesPackageExists ? 1 : 0)
    + (testResults.packagesInstalled ? 1 : 0)
    + (successfulBuilds / totalProjects)
    + (projectsWithDeps / totalProjects)
    + (projectsWithStyles / totalProjects)
  ) / 5

  testResults.overallSuccess = overallScore >= 0.8

  log(`\n🏆 总体评分: ${Math.round(overallScore * 100)}%`, overallScore >= 0.8 ? 'green' : overallScore >= 0.6 ? 'yellow' : 'red')

  if (testResults.overallSuccess) {
    log(`\n🎉 共享样式系统实施成功！`, 'green')
  }
  else {
    log(`\n⚠️  共享样式系统需要进一步优化`, 'yellow')
  }

  return testResults.overallSuccess
}

// 主测试流程
async function runTests() {
  logSection('🎨 共享样式系统测试')

  log('开始测试共享样式系统的实施情况...', 'blue')

  // 执行所有测试
  checkStylesPackage()
  checkDependencies()
  checkProjectStyles()
  testBuilds()

  // 生成报告
  const success = generateReport()

  // 退出代码
  process.exit(success ? 0 : 1)
}

// 运行测试
runTests().catch((error) => {
  log(`\n💥 测试执行失败: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
