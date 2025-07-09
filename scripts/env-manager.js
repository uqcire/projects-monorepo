#!/usr/bin/env node

/**
 * 环境管理脚本
 * 支持不同环境的配置和变量管理
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// 环境配置
const environments = {
  development: {
    NODE_ENV: 'development',
    VITE_API_URL: 'http://localhost:3000/api',
    VITE_APP_ENV: 'development',
    VITE_DEBUG: 'true',
    VITE_LOG_LEVEL: 'debug',
  },
  staging: {
    NODE_ENV: 'staging',
    VITE_API_URL: 'https://staging-api.example.com/api',
    VITE_APP_ENV: 'staging',
    VITE_DEBUG: 'false',
    VITE_LOG_LEVEL: 'warn',
  },
  production: {
    NODE_ENV: 'production',
    VITE_API_URL: 'https://api.example.com/api',
    VITE_APP_ENV: 'production',
    VITE_DEBUG: 'false',
    VITE_LOG_LEVEL: 'error',
  },
  test: {
    NODE_ENV: 'test',
    VITE_API_URL: 'http://localhost:3000/api',
    VITE_APP_ENV: 'test',
    VITE_DEBUG: 'true',
    VITE_LOG_LEVEL: 'debug',
  },
}

// 项目特定的环境变量
const projectSpecificVars = {
  'dflm': {
    VITE_APP_NAME: 'DFLM Website',
    VITE_APP_TITLE: '大蒜酱网站',
  },
  'basketball-score': {
    VITE_APP_NAME: 'Basketball Score',
    VITE_APP_TITLE: '篮球计分器',
  },
  'cirq': {
    VITE_APP_NAME: 'Cirq',
    VITE_APP_TITLE: '联系人管理',
  },
  'gcn-website': {
    VITE_APP_NAME: 'GCN Website',
    VITE_APP_TITLE: 'GCN 网站',
  },
  'site-template': {
    VITE_APP_NAME: 'Site Template',
    VITE_APP_TITLE: '网站模板',
  },
}

// 项目路径映射
const projectPaths = {
  'dflm': 'packages/apps/dflm',
  'basketball-score': 'packages/apps/basketball-score',
  'cirq': 'packages/apps/cirq',
  'gcn-website': 'packages/apps/gcn-website',
  'site-template': 'packages/apps/site-template',
}

// 解析命令行参数
const args = process.argv.slice(2)
const command = args[0]
const environment = args[1]
const project = args[2]

const options = {
  verbose: args.includes('--verbose') || args.includes('-v'),
  dryRun: args.includes('--dry-run'),
  force: args.includes('--force'),
}

console.log('🌍 环境管理脚本')
console.log('='.repeat(50))

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
用法: node scripts/env-manager.js <command> [environment] [project]

命令:
  set <env> [project]     设置环境变量
  get [project]           获取当前环境变量
  list                    列出所有可用环境
  validate [env]          验证环境配置
  copy <from> <to>        复制环境配置
  reset [project]         重置环境配置

环境:
  development            开发环境
  staging                预发布环境
  production             生产环境
  test                   测试环境

项目:
  dflm                   DFLM 网站
  basketball-score       篮球计分器
  cirq                   联系人管理
  gcn-website           GCN 网站
  site-template         网站模板
  all                   所有项目

选项:
  --verbose, -v          详细输出
  --dry-run             模拟运行
  --force               强制执行

示例:
  node scripts/env-manager.js set development
  node scripts/env-manager.js set production dflm
  node scripts/env-manager.js get dflm
  node scripts/env-manager.js list
`)
}

/**
 * 生成环境变量内容
 * @param {string} env - 环境名称
 * @param {string} projectName - 项目名称
 * @returns {string} 环境变量内容
 */
function generateEnvContent(env, projectName) {
  const baseVars = environments[env] || {}
  const projectVars = projectSpecificVars[projectName] || {}

  const allVars = { ...baseVars, ...projectVars }

  let content = `# 环境配置 - ${env.toUpperCase()}\n`
  content += `# 生成时间: ${new Date().toISOString()}\n\n`

  for (const [key, value] of Object.entries(allVars)) {
    content += `${key}=${value}\n`
  }

  return content
}

/**
 * 设置项目环境变量
 * @param {string} env - 环境名称
 * @param {string} projectName - 项目名称
 */
function setProjectEnv(env, projectName) {
  const projectPath = join(projectRoot, projectPaths[projectName])
  const envFile = join(projectPath, '.env')

  if (!existsSync(projectPath)) {
    console.error(`❌ 项目路径不存在: ${projectPath}`)
    return false
  }

  const content = generateEnvContent(env, projectName)

  if (options.dryRun) {
    console.log(`🔍 [DRY RUN] 将写入 ${envFile}:`)
    console.log(content)
    return true
  }

  try {
    // 安全提示：不创建备份文件以避免敏感信息泄露
    if (existsSync(envFile) && !options.force) {
      console.log(`⚠️  将覆盖现有环境文件: ${envFile}`)
      console.log(`💡 如需备份，请手动复制到项目外的安全位置`)
    }

    writeFileSync(envFile, content)
    console.log(`✅ 已设置 ${projectName} 环境为 ${env}`)

    if (options.verbose) {
      console.log(`📁 文件路径: ${envFile}`)
      console.log(`📝 内容预览:\n${content}`)
    }

    return true
  }
  catch (error) {
    console.error(`❌ 设置环境失败: ${error.message}`)
    return false
  }
}

/**
 * 获取项目环境变量
 * @param {string} projectName - 项目名称
 */
function getProjectEnv(projectName) {
  const projectPath = join(projectRoot, projectPaths[projectName])
  const envFile = join(projectPath, '.env')
  const envLocalFile = join(projectPath, '.env.local')

  console.log(`\n📋 ${projectName} 环境变量:`)
  console.log('-'.repeat(30))

  // 读取 .env 文件
  if (existsSync(envFile)) {
    console.log('📄 .env 文件:')
    const content = readFileSync(envFile, 'utf8')
    console.log(content)
  }
  else {
    console.log('❌ 未找到 .env 文件')
  }

  // 读取 .env.local 文件
  if (existsSync(envLocalFile)) {
    console.log('\n📄 .env.local 文件:')
    const content = readFileSync(envLocalFile, 'utf8')
    console.log(content)
  }
}

/**
 * 列出所有环境
 */
function listEnvironments() {
  console.log('\n🌍 可用环境:')
  console.log('-'.repeat(30))

  for (const [env, vars] of Object.entries(environments)) {
    console.log(`\n📦 ${env.toUpperCase()}:`)
    for (const [key, value] of Object.entries(vars)) {
      console.log(`   ${key}=${value}`)
    }
  }

  console.log('\n🏗️  项目特定变量:')
  console.log('-'.repeat(30))

  for (const [project, vars] of Object.entries(projectSpecificVars)) {
    console.log(`\n📁 ${project}:`)
    for (const [key, value] of Object.entries(vars)) {
      console.log(`   ${key}=${value}`)
    }
  }
}

/**
 * 验证环境配置
 * @param {string} env - 环境名称
 */
function validateEnvironment(env) {
  console.log(`\n🔍 验证环境配置: ${env}`)
  console.log('-'.repeat(30))

  if (!environments[env]) {
    console.error(`❌ 未知环境: ${env}`)
    return false
  }

  const config = environments[env]
  let valid = true

  // 检查必需的变量
  const requiredVars = ['NODE_ENV', 'VITE_API_URL', 'VITE_APP_ENV']

  for (const varName of requiredVars) {
    if (!config[varName]) {
      console.error(`❌ 缺少必需变量: ${varName}`)
      valid = false
    }
    else {
      console.log(`✅ ${varName}: ${config[varName]}`)
    }
  }

  // 检查 URL 格式
  if (config.VITE_API_URL) {
    try {
      const url = new URL(config.VITE_API_URL)
      console.log(`✅ VITE_API_URL 格式有效: ${url.origin}`)
    }
    catch {
      console.error(`❌ VITE_API_URL 格式无效: ${config.VITE_API_URL}`)
      valid = false
    }
  }

  return valid
}

/**
 * 复制环境配置
 * @param {string} fromEnv - 源环境
 * @param {string} toEnv - 目标环境
 */
function copyEnvironment(fromEnv, toEnv) {
  if (!environments[fromEnv]) {
    console.error(`❌ 源环境不存在: ${fromEnv}`)
    return false
  }

  console.log(`📋 复制环境配置: ${fromEnv} → ${toEnv}`)

  if (options.dryRun) {
    console.log(`🔍 [DRY RUN] 将复制配置`)
    return true
  }

  environments[toEnv] = { ...environments[fromEnv] }
  environments[toEnv].NODE_ENV = toEnv
  environments[toEnv].VITE_APP_ENV = toEnv

  console.log(`✅ 环境配置已复制`)
  return true
}

/**
 * 重置项目环境
 * @param {string} projectName - 项目名称
 */
function resetProjectEnv(projectName) {
  const projectPath = join(projectRoot, projectPaths[projectName])
  const envFile = join(projectPath, '.env')
  const envLocalFile = join(projectPath, '.env.local')

  console.log(`🔄 重置 ${projectName} 环境配置`)

  if (options.dryRun) {
    console.log(`🔍 [DRY RUN] 将删除环境文件`)
    return true
  }

  let reset = false

  if (existsSync(envFile)) {
    // 直接删除，不创建备份以避免敏感信息泄露
    console.log(`⚠️  即将删除环境文件: ${envFile}`)

    try {
      require('node:fs').unlinkSync(envFile)
      console.log(`✅ 已删除 .env 文件`)
      reset = true
    }
    catch (error) {
      console.error(`❌ 删除 .env 文件失败: ${error.message}`)
    }
  }

  if (existsSync(envLocalFile)) {
    try {
      require('node:fs').unlinkSync(envLocalFile)
      console.log(`✅ 已删除 .env.local 文件`)
      reset = true
    }
    catch (error) {
      console.error(`❌ 删除 .env.local 文件失败: ${error.message}`)
    }
  }

  if (!reset) {
    console.log(`ℹ️  ${projectName} 没有需要重置的环境文件`)
  }

  return true
}

// 主执行逻辑
try {
  if (!command || command === 'help') {
    showHelp()
    process.exit(0)
  }

  switch (command) {
    case 'set': {
      if (!environment) {
        console.error('❌ 请指定环境名称')
        showHelp()
        process.exit(1)
      }

      if (!environments[environment]) {
        console.error(`❌ 未知环境: ${environment}`)
        process.exit(1)
      }

      const targetProjects = project === 'all' || !project
        ? Object.keys(projectPaths)
        : [project]

      let success = true
      for (const proj of targetProjects) {
        if (!projectPaths[proj]) {
          console.error(`❌ 未知项目: ${proj}`)
          success = false
          continue
        }

        if (!setProjectEnv(environment, proj)) {
          success = false
        }
      }

      process.exit(success ? 0 : 1)
      break
    }

    case 'get': {
      const targetProjects = project === 'all' || !project
        ? Object.keys(projectPaths)
        : [project]

      for (const proj of targetProjects) {
        if (!projectPaths[proj]) {
          console.error(`❌ 未知项目: ${proj}`)
          continue
        }
        getProjectEnv(proj)
      }
      break
    }

    case 'list': {
      listEnvironments()
      break
    }

    case 'validate': {
      const env = environment || 'development'
      const valid = validateEnvironment(env)
      process.exit(valid ? 0 : 1)
      break
    }

    case 'copy': {
      const fromEnv = environment
      const toEnv = project

      if (!fromEnv || !toEnv) {
        console.error('❌ 请指定源环境和目标环境')
        showHelp()
        process.exit(1)
      }

      const success = copyEnvironment(fromEnv, toEnv)
      process.exit(success ? 0 : 1)
      break
    }

    case 'reset': {
      const targetProjects = project === 'all' || !project
        ? Object.keys(projectPaths)
        : [project]

      let success = true
      for (const proj of targetProjects) {
        if (!projectPaths[proj]) {
          console.error(`❌ 未知项目: ${proj}`)
          success = false
          continue
        }

        if (!resetProjectEnv(proj)) {
          success = false
        }
      }

      process.exit(success ? 0 : 1)
      break
    }

    default: {
      console.error(`❌ 未知命令: ${command}`)
      showHelp()
      process.exit(1)
    }
  }
}
catch (error) {
  console.error('❌ 执行过程中发生错误:', error.message)
  process.exit(1)
}
