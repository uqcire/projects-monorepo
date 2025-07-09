import { defineConfig } from 'vitest/config'

/**
 * 基础 Vitest 配置
 * 提供通用的测试环境设置
 */
export default defineConfig({
  test: {
    // 测试环境
    environment: 'jsdom',

    // 全局配置
    globals: true,

    // 包含的测试文件模式
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],

    // 排除的文件模式
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      '**/coverage/**',
    ],

    // 测试超时设置
    testTimeout: 10000,
    hookTimeout: 10000,

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        'packages/*/test{,s}/**',
        '**/*.d.ts',
        'cypress/**',
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
        '**/node_modules/**',
      ],
      thresholds: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50,
        },
      },
    },

    // 报告器配置
    reporter: ['verbose', 'json', 'html'],

    // 输出目录
    outputFile: {
      json: './test-results.json',
      html: './test-results.html',
    },

    // 监听模式配置
    watch: false,

    // 单次运行配置
    run: true,

    // 并发设置
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
      },
    },
  },
})
