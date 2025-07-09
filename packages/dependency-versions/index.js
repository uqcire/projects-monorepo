/**
 * 统一的依赖版本管理
 * 这个文件定义了 monorepo 中所有项目应该使用的依赖版本
 */

// 核心框架版本
export const versions = {
  // Vue 生态系统
  'vue': '^3.5.17',
  'vue-router': '^4.5.1',
  'pinia': '^3.0.3',

  // 构建工具
  'vite': '^6.3.5',
  '@vitejs/plugin-vue': '^5.2.4',

  // 工具库
  'axios': '^1.10.0',

  // 样式框架
  '@tailwindcss/vite': '^4.1.11',
  'tailwindcss': '^4.1.11',
  'daisyui': '5.0.0',

  // 代码质量工具
  'eslint': '^9.30.1',
  'typescript': '^5.8.3',

  // 构建优化
  'rollup-plugin-visualizer': '^5.14.0',
  'vite-plugin-compression': '^0.5.1',
}

// 开发依赖版本
export const devVersions = {
  // 图标和组件
  '@iconify/json': '^2.2.356',
  'unplugin-auto-import': '^19.3.0',
  'unplugin-vue-components': '^28.8.0',
  'unplugin-icons': '^22.1.0',

  // 测试框架
  'vitest': '^2.1.8',
  '@vitest/coverage-v8': '^2.1.8',
  '@vue/test-utils': '^2.4.6',
  'jsdom': '^25.0.1',
  'happy-dom': '^15.11.6',

  // 代码质量
  'eslint-plugin-format': '^1.0.1',

  // Git 工具
  'husky': '^9.1.7',
  'lint-staged': '^15.5.2',

  // 提交工具
  'commitlint-config-cz': '^0.13.3',
  'cz-git': '^1.11.2',
  'czg': '^1.11.2',

  // TypeScript 类型定义
  '@types/node': '^22.0.0',
  '@vue/tsconfig': '^0.5.1',
}

// 项目特有的依赖版本
export const projectSpecificVersions = {
  // 共享包 (monorepo 内部)
  '@shared/tailwind-config': 'workspace:*',
  '@shared/dependency-versions': 'workspace:*',
  '@monorepo/styles': 'workspace:*',
  '@monorepo/typescript-config': 'workspace:*',
  '@monorepo/vitest-config': 'workspace:*',

  // Supabase (用于 basketball-score 和 cirq)
  '@supabase/supabase-js': '^2.50.3',

  // ID 生成 (用于 basketball-score)
  'nanoid': '^5.1.5',

  // Vue DevTools (可选)
  'vite-plugin-vue-devtools': '^7.7.7',

  // Naive UI (用于 gcn-website)
  'naive-ui': '^2.42.0',
  '@vicons/antd': '^0.11.0',
  '@vicons/utils': '^0.1.4',

  // TypeScript 相关
  '@typescript-eslint/eslint-plugin': '^5.62.0',
  '@typescript-eslint/parser': '^5.62.0',
  'vue-tsc': '^2.1.10',

  // 样式处理
  'sass': '^1.89.2',
  'autoprefixer': '^10.4.21',
  'postcss': '^8.5.6',
}

// 统一的 packageManager 版本
export const packageManager = 'pnpm@10.12.4'

// Node.js 版本
export const nodeVersion = '20.11.0'

// 获取指定依赖的版本
export function getVersion(packageName) {
  return versions[packageName] || devVersions[packageName] || projectSpecificVersions[packageName]
}

// 获取所有版本的合并对象
export function getAllVersions() {
  return {
    ...versions,
    ...devVersions,
    ...projectSpecificVersions,
  }
}
