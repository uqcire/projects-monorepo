import { existsSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

import chalk from 'chalk'
import { glob } from 'glob'
import { MetricsCollector } from '../utils/MetricsCollector.js'

export class BundleAnalyzer {
  constructor(projectPath = '.') {
    this.projectPath = resolve(projectPath)
    this.metrics = new MetricsCollector()
  }

  async analyze() {
    console.log(chalk.blue('🔍 开始分析打包体积...'))

    const results = {
      projectPath: this.projectPath,
      timestamp: new Date().toISOString(),
      analysis: {},
      summary: {},
      recommendations: [],
    }

    // 分析dist目录
    const distPath = join(this.projectPath, 'dist')
    if (existsSync(distPath)) {
      results.analysis.dist = await this.analyzeDirectory(distPath)
    }

    // 分析src目录
    const srcPath = join(this.projectPath, 'src')
    if (existsSync(srcPath)) {
      results.analysis.src = await this.analyzeDirectory(srcPath)
    }

    // 分析node_modules大小
    const nodeModulesPath = join(this.projectPath, 'node_modules')
    if (existsSync(nodeModulesPath)) {
      results.analysis.nodeModules = await this.analyzeNodeModules(nodeModulesPath)
    }

    // 生成总结
    results.summary = this.generateSummary(results.analysis)

    // 生成优化建议
    results.recommendations = this.generateRecommendations(results.analysis)

    console.log(chalk.green('✅ 打包分析完成'))
    return results
  }

  async analyzeDirectory(dirPath) {
    const files = await glob('**/*', { cwd: dirPath, nodir: true })
    const analysis = {
      totalFiles: files.length,
      totalSize: 0,
      fileTypes: {},
      largestFiles: [],
      assets: {
        js: { count: 0, size: 0 },
        css: { count: 0, size: 0 },
        html: { count: 0, size: 0 },
        images: { count: 0, size: 0 },
        fonts: { count: 0, size: 0 },
        other: { count: 0, size: 0 },
      },
    }

    const fileDetails = []

    for (const file of files) {
      const filePath = join(dirPath, file)
      const stats = statSync(filePath)
      const size = stats.size
      const ext = extname(file).toLowerCase()

      analysis.totalSize += size
      fileDetails.push({ file, size, ext })

      // 按文件类型分组
      if (!analysis.fileTypes[ext]) {
        analysis.fileTypes[ext] = { count: 0, size: 0 }
      }
      analysis.fileTypes[ext].count++
      analysis.fileTypes[ext].size += size

      // 按资源类型分类
      if (['.js', '.mjs', '.ts'].includes(ext)) {
        analysis.assets.js.count++
        analysis.assets.js.size += size
      }
      else if (['.css', '.scss', '.sass', '.less'].includes(ext)) {
        analysis.assets.css.count++
        analysis.assets.css.size += size
      }
      else if (['.html', '.htm'].includes(ext)) {
        analysis.assets.html.count++
        analysis.assets.html.size += size
      }
      else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
        analysis.assets.images.count++
        analysis.assets.images.size += size
      }
      else if (['.woff', '.woff2', '.ttf', '.eot', '.otf'].includes(ext)) {
        analysis.assets.fonts.count++
        analysis.assets.fonts.size += size
      }
      else {
        analysis.assets.other.count++
        analysis.assets.other.size += size
      }
    }

    // 获取最大的文件
    analysis.largestFiles = fileDetails
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .map(({ file, size }) => ({ file, size: this.formatBytes(size) }))

    return analysis
  }

  async analyzeNodeModules(nodeModulesPath) {
    const packages = await glob('*', { cwd: nodeModulesPath })
    let totalSize = 0
    const packageSizes = []

    for (const pkg of packages.slice(0, 20)) { // 限制只分析前20个包避免太慢
      const pkgPath = join(nodeModulesPath, pkg)
      try {
        const stats = statSync(pkgPath)
        if (stats.isDirectory()) {
          const size = await this.getDirectorySize(pkgPath)
          totalSize += size
          packageSizes.push({ package: pkg, size })
        }
      }
      catch {
        // 忽略无法访问的包
      }
    }

    return {
      totalPackages: packages.length,
      analyzedPackages: packageSizes.length,
      totalSize,
      largestPackages: packageSizes
        .sort((a, b) => b.size - a.size)
        .slice(0, 10)
        .map(({ package: pkg, size }) => ({ package: pkg, size: this.formatBytes(size) })),
    }
  }

  async getDirectorySize(dirPath) {
    try {
      const files = await glob('**/*', { cwd: dirPath, nodir: true })
      let totalSize = 0

      for (const file of files.slice(0, 100)) { // 限制文件数量
        try {
          const filePath = join(dirPath, file)
          const stats = statSync(filePath)
          totalSize += stats.size
        }
        catch {
          // 忽略无法访问的文件
        }
      }

      return totalSize
    }
    catch {
      return 0
    }
  }

  generateSummary(analysis) {
    const summary = {
      totalDistSize: analysis.dist ? this.formatBytes(analysis.dist.totalSize) : 'N/A',
      totalSrcSize: analysis.src ? this.formatBytes(analysis.src.totalSize) : 'N/A',
      nodeModulesSize: analysis.nodeModules ? this.formatBytes(analysis.nodeModules.totalSize) : 'N/A',
      bundleComposition: {},
    }

    if (analysis.dist && analysis.dist.assets) {
      const assets = analysis.dist.assets
      const total = analysis.dist.totalSize

      summary.bundleComposition = {
        javascript: `${this.formatBytes(assets.js.size)} (${((assets.js.size / total) * 100).toFixed(1)}%)`,
        css: `${this.formatBytes(assets.css.size)} (${((assets.css.size / total) * 100).toFixed(1)}%)`,
        images: `${this.formatBytes(assets.images.size)} (${((assets.images.size / total) * 100).toFixed(1)}%)`,
        fonts: `${this.formatBytes(assets.fonts.size)} (${((assets.fonts.size / total) * 100).toFixed(1)}%)`,
        other: `${this.formatBytes(assets.other.size)} (${((assets.other.size / total) * 100).toFixed(1)}%)`,
      }
    }

    return summary
  }

  generateRecommendations(analysis) {
    const recommendations = []

    if (analysis.dist) {
      const { totalSize, assets } = analysis.dist

      // JavaScript 包大小建议
      if (assets.js.size > 1024 * 1024) { // 大于1MB
        recommendations.push({
          type: 'javascript',
          priority: 'high',
          message: `JavaScript 包体积过大 (${this.formatBytes(assets.js.size)})，建议启用代码分割和懒加载`,
        })
      }

      // CSS 大小建议
      if (assets.css.size > 512 * 1024) { // 大于512KB
        recommendations.push({
          type: 'css',
          priority: 'medium',
          message: `CSS 文件较大 (${this.formatBytes(assets.css.size)})，建议使用 CSS purge 移除未使用的样式`,
        })
      }

      // 图片优化建议
      if (assets.images.size > 2 * 1024 * 1024) { // 大于2MB
        recommendations.push({
          type: 'images',
          priority: 'high',
          message: `图片资源较大 (${this.formatBytes(assets.images.size)})，建议压缩图片或使用 WebP 格式`,
        })
      }

      // 总体积建议
      if (totalSize > 5 * 1024 * 1024) { // 大于5MB
        recommendations.push({
          type: 'overall',
          priority: 'high',
          message: `总打包体积过大 (${this.formatBytes(totalSize)})，建议进行整体优化`,
        })
      }
    }

    if (analysis.nodeModules) {
      if (analysis.nodeModules.totalSize > 100 * 1024 * 1024) { // 大于100MB
        recommendations.push({
          type: 'dependencies',
          priority: 'medium',
          message: `依赖包体积较大 (${this.formatBytes(analysis.nodeModules.totalSize)})，建议审查依赖并移除不必要的包`,
        })
      }
    }

    return recommendations
  }

  formatBytes(bytes) {
    if (bytes === 0)
      return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`
  }
}
