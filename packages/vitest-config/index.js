/**
 * Vitest 配置包的 JavaScript API
 * 提供便捷的配置加载和自定义功能
 */

import { mergeConfig } from 'vitest/config'

// 预定义的配置加载器
export const configs = {
  base: () => import('./vitest.config.base.js').then(m => m.default),
  vue: () => import('./vitest.config.vue.js').then(m => m.default),
  node: () => import('./vitest.config.node.js').then(m => m.default),
}

/**
 * 创建自定义 Vitest 配置
 * @param {string} baseConfig - 基础配置类型 ('base' | 'vue' | 'node')
 * @param {object} customConfig - 自定义配置对象
 * @returns {Promise<object>} 合并后的配置
 */
export async function createConfig(baseConfig = 'base', customConfig = {}) {
  const baseConfigFn = configs[baseConfig]
  if (!baseConfigFn) {
    throw new Error(`未知的基础配置类型: ${baseConfig}`)
  }

  const base = await baseConfigFn()
  return mergeConfig(base, customConfig)
}

/**
 * 创建 Vue 项目的 Vitest 配置
 * @param {object} customConfig - 自定义配置
 * @returns {Promise<object>} Vue 项目配置
 */
export async function createVueConfig(customConfig = {}) {
  return createConfig('vue', customConfig)
}

/**
 * 创建 Node.js 项目的 Vitest 配置
 * @param {object} customConfig - 自定义配置
 * @returns {Promise<object>} Node.js 项目配置
 */
export async function createNodeConfig(customConfig = {}) {
  return createConfig('node', customConfig)
}

/**
 * 项目特定的配置映射
 * 根据项目名称提供预配置的测试设置
 */
export const projectConfigs = {
  'dflm': {
    type: 'vue',
    coverage: {
      thresholds: {
        global: {
          branches: 60,
          functions: 60,
          lines: 60,
          statements: 60,
        },
      },
    },
    testMatch: [
      'src/components/**/*.test.{js,ts,vue}',
      'src/views/**/*.test.{js,ts,vue}',
      'src/utils/**/*.test.{js,ts}',
    ],
  },

  'basketball-score': {
    type: 'vue',
    coverage: {
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    testMatch: [
      'src/stores/**/*.test.{js,ts}',
      'src/utils/**/*.test.{js,ts}',
      'src/components/**/*.test.{js,ts,vue}',
    ],
  },

  'cirq': {
    type: 'vue',
    coverage: {
      thresholds: {
        global: {
          branches: 65,
          functions: 65,
          lines: 65,
          statements: 65,
        },
      },
    },
  },

  'gcn-website': {
    type: 'vue',
    coverage: {
      thresholds: {
        global: {
          branches: 55,
          functions: 55,
          lines: 55,
          statements: 55,
        },
      },
    },
  },

  'site-template': {
    type: 'vue',
    coverage: {
      thresholds: {
        global: {
          branches: 40,
          functions: 40,
          lines: 40,
          statements: 40,
        },
      },
    },
  },
}

/**
 * 获取项目特定的配置
 * @param {string} projectName - 项目名称
 * @returns {Promise<object>} 项目配置
 */
export async function getProjectConfig(projectName) {
  const projectConfig = projectConfigs[projectName]
  if (!projectConfig) {
    console.warn(`未找到项目 ${projectName} 的特定配置，使用默认 Vue 配置`)
    return createVueConfig()
  }

  return createConfig(projectConfig.type, {
    test: {
      coverage: projectConfig.coverage,
      include: projectConfig.testMatch || [
        'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx,vue}',
      ],
    },
  })
}

// 导出配置类型常量
export const CONFIG_TYPES = {
  BASE: 'base',
  VUE: 'vue',
  NODE: 'node',
}

// 导出项目名称常量
export const PROJECT_NAMES = Object.keys(projectConfigs)
