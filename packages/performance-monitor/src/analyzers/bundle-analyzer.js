import path from 'node:path'
import { filesize } from 'filesize'
import fs from 'fs-extra'
import { glob } from 'glob'
import { MetricsCollector } from '../utils/metrics-collector.js'

/**
 * 打包体积分析器 - 分析项目的打包文件大小和结构
 */
export class BundleAnalyzer {
  constructor(options = {}) {
    this.options = {
      outputDir: 'dist',
      includeGzip: true,
      includeSourceMaps: true,
      ...options,
    }
    this.collector = new MetricsCollector()
  }

  /**
   * 分析指定项目的打包结果
   * @param {string} projectPath - 项目路径
   * @returns {object} 分析结果
   */
  async analyze(projectPath = '.') {
    this.collector.startTimer('bundle-analysis')

    try {
      const results = {
        projectPath,
        timestamp: new Date().toISOString(),
        summary: { totalSize: 0, humanTotalSize: '0 B', totalFiles: 0, largestFiles: [] },
        files: [],
        assets: {},
        warnings: [],
        recommendations: [],
      }

      // 分析构建输出目录
      const distPath = path.join(projectPath, this.options.outputDir)
      const distExists = await fs.pathExists(distPath)

      if (!distExists) {
        results.warnings.push(`构建目录 ${distPath} 不存在，请先运行构建命令`)
        return results
      }

      // 收集所有文件信息
      const allFiles = await this.collectBundleFiles(distPath)
      results.files = allFiles
      results.summary = this.generateSummary(allFiles)

      const analysisTime = this.collector.endTimer('bundle-analysis')
      results.analysisTime = `${analysisTime.toFixed(2)}ms`

      return results
    }
    catch (error) {
      this.collector.endTimer('bundle-analysis')
      throw new Error(`Bundle analysis failed: ${error.message}`)
    }
  }

  async collectBundleFiles(distPath) {
    const files = []
    const patterns = ['**/*.js', '**/*.css', '**/*.html']

    for (const pattern of patterns) {
      const matches = await glob(pattern, { cwd: distPath, nodir: true })
      for (const match of matches) {
        const fullPath = path.join(distPath, match)
        const stats = await fs.stat(fullPath)
        files.push({
          path: match,
          size: stats.size,
          humanSize: filesize(stats.size),
        })
      }
    }

    return files.sort((a, b) => b.size - a.size)
  }

  generateSummary(files) {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    return {
      totalSize,
      humanTotalSize: filesize(totalSize),
      totalFiles: files.length,
      largestFiles: files.slice(0, 5),
    }
  }
}
