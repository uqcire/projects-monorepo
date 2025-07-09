import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import chalk from 'chalk'
import { glob } from 'glob'

// 根目录的依赖，这些应该从子项目中移除
const ROOT_DEPENDENCIES = [
  // 构建工具
  '@vitejs/plugin-vue',
  'vite',
  'rollup-plugin-visualizer',
  'vite-plugin-compression',

  // CSS框架
  'tailwindcss',
  'daisyui',
  '@tailwindcss/vite',

  // TypeScript
  'typescript',

  // 代码质量工具
  'eslint',
  'eslint-plugin-format',
  'prettier',

  // Vue工具
  'unplugin-auto-import',
  'unplugin-vue-components',

  // Git工具
  'husky',
  'lint-staged',
  'cz-git',
  'czg',
  'commitlint-config-cz',

  // 其他工具
  'chalk',
  'glob',
  'cross-env',
]

async function cleanupDuplicateDeps() {
  console.log(chalk.blue('🧹 开始清理重复依赖...'))

  try {
    // 查找所有子项目的package.json文件
    const packageJsonFiles = await glob('packages/**/package.json', {
      ignore: ['**/node_modules/**'],
    })

    let totalRemoved = 0
    let filesModified = 0

    for (const file of packageJsonFiles) {
      // 跳过根目录
      if (file === 'package.json')
        continue

      console.log(chalk.gray(`检查: ${file}`))

      const content = readFileSync(file, 'utf-8')
      const packageJson = JSON.parse(content)
      let modified = false
      let removedCount = 0

      // 检查devDependencies
      if (packageJson.devDependencies) {
        for (const dep of ROOT_DEPENDENCIES) {
          if (packageJson.devDependencies[dep]) {
            console.log(chalk.yellow(`  移除 devDependency: ${dep}`))
            delete packageJson.devDependencies[dep]
            modified = true
            removedCount++
          }
        }

        // 如果devDependencies为空，删除整个字段
        if (Object.keys(packageJson.devDependencies).length === 0) {
          delete packageJson.devDependencies
        }
      }

      // 检查dependencies (通常不移除，但可以检查一些构建工具)
      const BUILD_TOOLS_TO_REMOVE = ['vite', 'rollup-plugin-visualizer']
      if (packageJson.dependencies) {
        for (const dep of BUILD_TOOLS_TO_REMOVE) {
          if (packageJson.dependencies[dep]) {
            console.log(chalk.yellow(`  移除 dependency: ${dep}`))
            delete packageJson.dependencies[dep]
            modified = true
            removedCount++
          }
        }
      }

      if (modified) {
        // 保存修改后的文件
        writeFileSync(file, `${JSON.stringify(packageJson, null, 2)}\n`)
        console.log(chalk.green(`  ✅ 已更新 ${file} (移除了 ${removedCount} 个依赖)`))
        filesModified++
        totalRemoved += removedCount
      }
    }

    console.log(chalk.bold.green(`\n🎉 清理完成!`))
    console.log(`  修改的文件: ${filesModified} 个`)
    console.log(`  移除的依赖: ${totalRemoved} 个`)

    if (totalRemoved > 0) {
      console.log(chalk.blue('\n💡 建议运行以下命令更新依赖:'))
      console.log('  pnpm install')
    }
  }
  catch (error) {
    console.error(chalk.red('❌ 清理失败:'), error.message)
    process.exit(1)
  }
}

// 仅在直接运行时执行
if (process.argv[1] && process.argv[1].includes('cleanup-duplicate-deps.js')) {
  cleanupDuplicateDeps()
}

export default cleanupDuplicateDeps
