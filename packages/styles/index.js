/*
  Monorepo Styles Package
  统一样式系统的主入口文件
*/

// 导出所有样式模块
export const styleModules = {
  reset: () => import('./reset.css'),
  base: () => import('./base.css'),
  themes: () => import('./themes.css'),
  fonts: () => import('./fonts.css'),
  components: () => import('./components.css'),
  utilities: () => import('./utilities.css'),
}

// 主题配置
export const themes = [
  'light',
  'dark',
  'basketball',
  'cirq',
  'dflm',
  'gcn',
  'high-contrast',
]

// 项目主题映射
export const projectThemes = {
  'basketball-score': 'basketball',
  'cirq': 'cirq',
  'dflm': 'dflm',
  'gcn-website': 'gcn',
  'site-template': 'light',
}

// 样式加载函数
export function loadStyles(modules = ['reset', 'base', 'themes']) {
  const promises = modules.map((module) => {
    if (styleModules[module]) {
      return styleModules[module]()
    }
    console.warn(`Style module "${module}" not found`)
    return Promise.resolve()
  })

  return Promise.all(promises)
}

// 主题切换函数
export function setTheme(theme) {
  if (!themes.includes(theme)) {
    console.warn(`Theme "${theme}" not found. Available themes:`, themes)
    return false
  }

  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  return true
}

// 获取当前主题
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light'
}

// 项目主题设置
export function setProjectTheme(projectName) {
  const theme = projectThemes[projectName]
  if (theme) {
    setTheme(theme)
    document.documentElement.setAttribute('data-project', projectName)
    return theme
  }
  console.warn(`No theme configured for project "${projectName}"`)
  return null
}

// 自动检测系统主题偏好
export function detectSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

// 初始化主题
export function initTheme(projectName = null) {
  // 优先级：项目主题 > 本地存储 > 系统主题 > 默认主题
  let theme = null

  if (projectName && projectThemes[projectName]) {
    theme = projectThemes[projectName]
  }
  else {
    theme = localStorage.getItem('theme') || detectSystemTheme()
  }

  setTheme(theme)

  if (projectName) {
    setProjectTheme(projectName)
  }

  return theme
}

// 监听系统主题变化
export function watchSystemTheme() {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    })
  }
}

// 默认导出
export default {
  styleModules,
  themes,
  projectThemes,
  loadStyles,
  setTheme,
  getCurrentTheme,
  setProjectTheme,
  detectSystemTheme,
  initTheme,
  watchSystemTheme,
}
