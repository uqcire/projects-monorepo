#!/usr/bin/env node

import { glob } from 'glob'
import { readFileSync } from 'node:fs'
import { getAllVersions } from '../packages/dependency-versions/index.js'

console.log('🔍 检查依赖版本一致性...\n')

// 获取标准版本
const standardVersions = getAllVersions()

// 获取所有项目的 package.json 文件 (适应新的 monorepo 结构)
const packageFiles = glob.sync('packages/apps/*/package.json', {
  ignore: ['node_modules/**'],
})

// 存储发现的问题
const issues = []

packageFiles.forEach((file) => {
  const projectName = file.replace('packages/apps/', '').replace('/package.json', '')
  console.log(`📦 检查项目: ${projectName}`)

  const pkg = JSON.parse(readFileSync(file, 'utf8'))
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }

  Object.entries(allDeps).forEach(([name, version]) => {
    const standardVersion = standardVersions[name]

    if (standardVersion && version !== standardVersion) {
      issues.push({
        project: projectName,
        package: name,
        current: version,
        expected: standardVersion,
      })
    }
  })
})

console.log(`\n${'='.repeat(60)}`)

if (issues.length === 0) {
  console.log('✅ 所有依赖版本都一致！')
}
else {
  console.log('⚠️  发现版本不一致的依赖：\n')

  // 按包名分组显示问题
  const groupedIssues = {}
  issues.forEach((issue) => {
    if (!groupedIssues[issue.package]) {
      groupedIssues[issue.package] = []
    }
    groupedIssues[issue.package].push(issue)
  })

  Object.entries(groupedIssues).forEach(([packageName, packageIssues]) => {
    console.log(`📌 ${packageName}:`)
    console.log(`   期望版本: ${packageIssues[0].expected}`)
    packageIssues.forEach((issue) => {
      console.log(`   ${issue.project}: ${issue.current}`)
    })
    console.log()
  })

  console.log(`🔧 建议运行: pnpm update --recursive 来更新依赖版本`)
}

console.log('='.repeat(60))
