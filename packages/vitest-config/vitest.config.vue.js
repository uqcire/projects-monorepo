import vue from '@vitejs/plugin-vue'
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config.base.js'

/**
 * Vue 项目专用的 Vitest 配置
 * 继承基础配置并添加 Vue 相关设置
 */
export default defineConfig(configEnv =>
  mergeConfig(baseConfig, {
    plugins: [vue()],

    test: {
      // Vue 测试环境
      environment: 'jsdom',

      // 全局设置
      globals: true,

      // 设置文件
      setupFiles: ['./src/test/setup.ts'],

      // 环境选项
      environmentOptions: {
        jsdom: {
          resources: 'usable',
        },
      },

      // 转换配置
      transformMode: {
        web: [/\.[jt]sx?$/, /\.vue$/],
      },

      // 依赖处理
      deps: {
        inline: ['@vue', '@vueuse', 'vue-demi'],
      },
    },

    // 解析配置
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
        '~': new URL('./src', import.meta.url).pathname,
        '#': new URL('./src', import.meta.url).pathname,
      },
    },

    // 定义全局变量
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
  }),
)
