/**
 * @monorepo/typescript-config
 * 共享 TypeScript 配置包
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 读取配置文件
 * @param {string} configName - 配置文件名
 * @returns {object} 配置对象
 */
function loadConfig(configName) {
  const configPath = join(__dirname, `${configName}.json`)
  try {
    const content = readFileSync(configPath, 'utf8')
    return JSON.parse(content)
  }
  catch {
    throw new Error(`Failed to load TypeScript config: ${configName}`)
  }
}

/**
 * 预定义的配置
 */
export const configs = {
  base: () => loadConfig('tsconfig.base'),
  vue: () => loadConfig('tsconfig.vue'),
  node: () => loadConfig('tsconfig.node'),
  app: () => loadConfig('tsconfig.app'),
}

/**
 * 创建项目特定的 TypeScript 配置
 * @param {object} options - 配置选项
 * @param {string} options.extends - 继承的基础配置
 * @param {object} options.compilerOptions - 编译选项
 * @param {string[]} options.include - 包含的文件
 * @param {string[]} options.exclude - 排除的文件
 * @param {object} options.paths - 路径映射
 * @returns {object} 完整的 TypeScript 配置
 */
export function createConfig(options = {}) {
  const {
    extends: extendsConfig = './tsconfig.vue.json',
    compilerOptions = {},
    include = [],
    exclude = [],
    paths = {},
  } = options

  const baseConfig = {
    extends: extendsConfig,
    compilerOptions: {
      ...compilerOptions,
      ...(Object.keys(paths).length > 0 && {
        paths: {
          '@/*': ['src/*'],
          ...paths,
        },
      }),
    },
  }

  if (include.length > 0) {
    baseConfig.include = include
  }

  if (exclude.length > 0) {
    baseConfig.exclude = exclude
  }

  return baseConfig
}

/**
 * 为 Vue 项目创建配置
 * @param {object} options - Vue 特定选项
 * @returns {object} Vue TypeScript 配置
 */
export function createVueConfig(options = {}) {
  return createConfig({
    extends: '@monorepo/typescript-config/tsconfig.vue.json',
    compilerOptions: {
      baseUrl: '.',
      ...options.compilerOptions,
    },
    include: [
      'src/**/*.ts',
      'src/**/*.d.ts',
      'src/**/*.tsx',
      'src/**/*.vue',
      'components.d.ts',
      'auto-imports.d.ts',
      ...options.include || [],
    ],
    ...options,
  })
}

/**
 * 为 Node.js 项目创建配置
 * @param {object} options - Node.js 特定选项
 * @returns {object} Node.js TypeScript 配置
 */
export function createNodeConfig(options = {}) {
  return createConfig({
    extends: '@monorepo/typescript-config/tsconfig.node.json',
    include: [
      'vite.config.*',
      'vitest.config.*',
      'tailwind.config.*',
      'scripts/**/*',
      '*.config.*',
      ...options.include || [],
    ],
    ...options,
  })
}

/**
 * 项目类型映射
 */
export const projectConfigs = {
  'gcn-website': () => createVueConfig({
    compilerOptions: {
      paths: {
        '@/*': ['src/*'],
      },
      types: ['node', 'vite/client', 'naive-ui/volar'],
    },
    include: [
      'src/**/*.ts',
      'src/**/*.d.ts',
      'src/**/*.vue',
      'components.d.ts',
      'auto-imports.d.ts',
    ],
  }),
  'dflm-website': () => createVueConfig(),
  'basketball-score': () => createVueConfig(),
  'cirq': () => createVueConfig(),
  'site-template': () => createVueConfig(),
}

/**
 * 获取项目配置
 * @param {string} projectName - 项目名称
 * @returns {object} 项目 TypeScript 配置
 */
export function getProjectConfig(projectName) {
  const configFn = projectConfigs[projectName]
  if (!configFn) {
    return createVueConfig() // 默认 Vue 配置
  }
  return configFn()
}

// 默认导出
export default {
  configs,
  createConfig,
  createVueConfig,
  createNodeConfig,
  getProjectConfig,
  projectConfigs,
}
