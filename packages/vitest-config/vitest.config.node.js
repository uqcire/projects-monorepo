import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config.base.js'

/**
 * Node.js 项目专用的 Vitest 配置
 * 用于测试工具脚本、构建脚本等
 */
export default defineConfig(configEnv =>
  mergeConfig(baseConfig, {
    test: {
      // Node.js 环境
      environment: 'node',

      // 包含的测试文件（Node.js 项目）
      include: [
        'scripts/**/*.{test,spec}.{js,mjs,cjs,ts}',
        'tools/**/*.{test,spec}.{js,mjs,cjs,ts}',
        '**/*.node.{test,spec}.{js,mjs,cjs,ts}',
      ],

      // Node.js 特定的超时设置
      testTimeout: 15000,
      hookTimeout: 15000,

      // 覆盖率阈值（工具脚本要求较低）
      coverage: {
        thresholds: {
          global: {
            branches: 30,
            functions: 30,
            lines: 30,
            statements: 30,
          },
        },
      },
    },

    // Node.js 环境的解析配置
    resolve: {
      conditions: ['node'],
    },
  }),
)
