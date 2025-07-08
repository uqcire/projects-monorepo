const deepmerge = require('deepmerge')
const { fontFamily } = require('tailwindcss/defaultTheme')

/**
 * 基础的 Tailwind CSS 配置
 */
const baseConfig = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 基础的字体配置
      fontFamily: {
        sans: [...fontFamily.sans],
      },
      // 基础的颜色配置
      colors: {
        // 通用的状态颜色
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
  },
  plugins: [],
}

/**
 * DaisyUI 配置预设
 */
const daisyUIConfig = {
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
}

/**
 * 创建 Tailwind 配置
 * @param {object} options - 配置选项
 * @param {boolean} options.daisyui - 是否启用 DaisyUI
 * @param {object} options.extend - 自定义扩展配置
 * @param {Array} options.content - 内容扫描路径
 * @param {object} options.theme - 主题扩展
 * @param {Array} options.plugins - 额外插件
 * @param {boolean} options.preflight - 是否启用 preflight
 * @returns {object} Tailwind 配置对象
 */
function createTailwindConfig(options = {}) {
  const {
    daisyui = false,
    extend = {},
    content = [],
    theme = {},
    plugins = [],
    preflight = true,
  } = options

  let config = { ...baseConfig }

  // 合并内容扫描路径
  if (content.length > 0) {
    config.content = [...baseConfig.content, ...content]
  }

  // 合并主题配置
  if (Object.keys(theme).length > 0) {
    config.theme = deepmerge(config.theme, theme)
  }

  // 添加 DaisyUI 支持
  if (daisyui) {
    config = deepmerge(config, daisyUIConfig)
  }

  // 添加额外插件
  if (plugins.length > 0) {
    config.plugins = [...config.plugins, ...plugins]
  }

  // 配置 preflight
  if (!preflight) {
    config.corePlugins = { preflight: false }
  }

  // 应用自定义扩展
  if (Object.keys(extend).length > 0) {
    config = deepmerge(config, extend)
  }

  return config
}

module.exports = {
  createTailwindConfig,
  baseConfig,
  daisyUIConfig,
}
