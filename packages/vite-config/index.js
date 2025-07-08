import path from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import viteCompression from 'vite-plugin-compression'

/**
 * 创建基础的 Vue + Vite 配置
 * @param {object} options - 配置选项
 * @param {string} options.projectRoot - 项目根目录路径 (默认: process.cwd())
 * @param {boolean} options.enableDevtools - 是否启用 Vue DevTools (默认: false)
 * @param {boolean} options.enableIcons - 是否启用 Icons 插件 (默认: false)
 * @param {boolean} options.enableAutoImport - 是否启用自动导入 (默认: false)
 * @param {boolean} options.enableCompression - 是否启用压缩 (默认: true)
 * @param {boolean} options.enableVisualizer - 是否启用包分析 (默认: true)
 * @param {object} options.customPlugins - 自定义插件数组
 * @param {object} options.customConfig - 自定义配置对象，会与基础配置合并
 * @returns {Function} Vite 配置函数
 */
export function createVueViteConfig(options = {}) {
  const {
    projectRoot = process.cwd(),
    enableDevtools = false,
    enableIcons = false,
    enableAutoImport = false,
    enableCompression = true,
    enableVisualizer = true,
    customPlugins = [],
    customConfig = {},
  } = options

  return defineConfig(async (configEnv) => {
    const { mode } = configEnv

    // 加载环境变量
    const env = loadEnv(mode, projectRoot)

    // 处理环境变量 (如果项目有 wrapperEnv 工具函数，可以在这里调用)
    const VITE_PORT = env.VITE_PORT ? Number.parseInt(env.VITE_PORT) : 3000
    const VITE_PUBLIC_PATH = env.VITE_PUBLIC_PATH || '/'

    // 基础插件配置
    const plugins = [
      vue(),
      tailwindcss(),
      ...customPlugins,
    ]

    // 可选插件 - 使用 try/catch 处理缺失的依赖
    if (enableDevtools) {
      try {
        const { default: vueDevTools } = await import('vite-plugin-vue-devtools')
        plugins.push(vueDevTools())
      }
      catch {
        console.warn('vite-plugin-vue-devtools is not installed, skipping devtools plugin')
      }
    }

    if (enableIcons) {
      try {
        const { default: Icons } = await import('unplugin-icons/vite')
        const { default: Components } = await import('unplugin-vue-components/vite')
        const { default: IconsResolver } = await import('unplugin-icons/resolver')

        plugins.push(
          Icons({
            autoInstall: true,
          }),
          Components({
            resolvers: [IconsResolver()],
          }),
        )
      }
      catch {
        console.warn('unplugin-icons packages are not installed, skipping icons plugin')
      }
    }

    if (enableAutoImport) {
      try {
        const { default: AutoImport } = await import('unplugin-auto-import/vite')
        plugins.push(
          AutoImport({
            include: [
              /\.[tj]sx?$/,
              /\.vue$/,
              /\.vue\?vue/,
              /\.md$/,
            ],
            imports: ['vue', 'vue-router', 'pinia'],
            eslintrc: {
              enabled: false,
              filepath: './.eslintrc-auto-import.json',
              globalsPropValue: true,
            },
            dts: 'src/auto-imports.d.ts',
          }),
        )
      }
      catch {
        console.warn('unplugin-auto-import is not installed, skipping auto-import plugin')
      }
    }

    if (enableCompression) {
      plugins.push(
        viteCompression({
          deleteOriginFile: false,
        }),
      )
    }

    if (enableVisualizer) {
      plugins.push(
        visualizer({
          open: false, // 不自动打开，避免开发时干扰
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
      )
    }

    // 基础配置
    const baseConfig = {
      plugins,
      base: VITE_PUBLIC_PATH,
      resolve: {
        alias: {
          '@': path.resolve(projectRoot, 'src'),
        },
        extensions: [
          '.mjs',
          '.js',
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
          '.vue',
        ],
      },
      server: {
        host: true,
        port: VITE_PORT,
        open: false,
        strictPort: false,
        https: false,
        cors: true,
      },
      build: {
        target: 'modules',
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild', // 使用 esbuild 代替 terser，因为它是 Vite 的内置依赖
        rollupOptions: {
          output: {
            // 代码分割策略
            manualChunks: {
              vue: ['vue', 'vue-router', 'pinia'],
              vendor: ['axios'],
            },
          },
        },
      },
    }

    // 合并自定义配置
    return {
      ...baseConfig,
      ...customConfig,
      // 深度合并插件数组
      plugins: [...baseConfig.plugins, ...(customConfig.plugins || [])],
    }
  })
}

/**
 * 预设配置：标准 Vue 项目
 */
export function createStandardVueConfig(projectRoot) {
  return createVueViteConfig({
    projectRoot,
    enableCompression: true,
    enableVisualizer: true,
  })
}

/**
 * 预设配置：带图标的 Vue 项目
 */
export function createVueWithIconsConfig(projectRoot) {
  return createVueViteConfig({
    projectRoot,
    enableIcons: true,
    enableCompression: true,
    enableVisualizer: true,
  })
}

/**
 * 预设配置：开发模式配置
 */
export function createDevelopmentConfig(projectRoot) {
  return createVueViteConfig({
    projectRoot,
    enableDevtools: true,
    enableCompression: false,
    enableVisualizer: false,
  })
}
