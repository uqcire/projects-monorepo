import path from 'node:path'
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import { filesize } from 'filesize'
import fs from 'fs-extra'

/**
 * 指标收集器 - 用于收集各种性能指标
 */
export class MetricsCollector {
  constructor() {
    this.metrics = new Map()
    this.startTimes = new Map()
  }

  /**
   * 开始计时
   * @param {string} label - 计时标签
   */
  startTimer(label) {
    this.startTimes.set(label, performance.now())
  }

  /**
   * 结束计时并记录耗时
   * @param {string} label - 计时标签
   * @returns {number} 耗时（毫秒）
   */
  endTimer(label) {
    const startTime = this.startTimes.get(label)
    if (!startTime) {
      throw new Error(`Timer '${label}' was not started`)
    }

    const endTime = performance.now()
    const duration = endTime - startTime

    this.setMetric(label, duration)
    this.startTimes.delete(label)

    return duration
  }

  /**
   * 设置指标值
   * @param {string} key - 指标名称
   * @param {any} value - 指标值
   */
  setMetric(key, value) {
    this.metrics.set(key, value)
  }

  /**
   * 获取指标值
   * @param {string} key - 指标名称
   * @returns {any} 指标值
   */
  getMetric(key) {
    return this.metrics.get(key)
  }

  /**
   * 获取所有指标
   * @returns {object} 所有指标的对象
   */
  getAllMetrics() {
    return Object.fromEntries(this.metrics)
  }

  /**
   * 收集文件大小信息
   * @param {string} filePath - 文件路径
   * @returns {object} 文件大小信息
   */
  async collectFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath)
      const size = stats.size

      return {
        path: filePath,
        size,
        humanSize: filesize(size),
        lastModified: stats.mtime,
      }
    }
    catch (error) {
      return {
        path: filePath,
        size: 0,
        humanSize: '0 B',
        error: error.message,
      }
    }
  }

  /**
   * 收集目录大小信息
   * @param {string} dirPath - 目录路径
   * @returns {object} 目录大小信息
   */
  async collectDirectorySize(dirPath) {
    try {
      let totalSize = 0
      const files = []

      const walk = async (currentPath) => {
        const items = await fs.readdir(currentPath, { withFileTypes: true })

        for (const item of items) {
          const fullPath = path.join(currentPath, item.name)

          if (item.isDirectory()) {
            await walk(fullPath)
          }
          else {
            const stats = await fs.stat(fullPath)
            totalSize += stats.size
            files.push({
              path: fullPath,
              size: stats.size,
              humanSize: filesize(stats.size),
            })
          }
        }
      }

      await walk(dirPath)

      return {
        path: dirPath,
        totalSize,
        humanTotalSize: filesize(totalSize),
        fileCount: files.length,
        files: files.sort((a, b) => b.size - a.size), // 按大小降序排列
      }
    }
    catch (error) {
      return {
        path: dirPath,
        totalSize: 0,
        humanTotalSize: '0 B',
        fileCount: 0,
        files: [],
        error: error.message,
      }
    }
  }

  /**
   * 收集内存使用情况
   * @returns {object} 内存使用信息
   */
  collectMemoryUsage() {
    const usage = process.memoryUsage()

    return {
      rss: {
        bytes: usage.rss,
        human: filesize(usage.rss),
      },
      heapTotal: {
        bytes: usage.heapTotal,
        human: filesize(usage.heapTotal),
      },
      heapUsed: {
        bytes: usage.heapUsed,
        human: filesize(usage.heapUsed),
      },
      external: {
        bytes: usage.external,
        human: filesize(usage.external),
      },
      arrayBuffers: {
        bytes: usage.arrayBuffers,
        human: filesize(usage.arrayBuffers),
      },
    }
  }

  /**
   * 清空所有指标
   */
  clear() {
    this.metrics.clear()
    this.startTimes.clear()
  }

  /**
   * 导出指标到JSON文件
   * @param {string} outputPath - 输出文件路径
   */
  async exportMetrics(outputPath) {
    const data = {
      metrics: this.getAllMetrics(),
      timestamp: new Date().toISOString(),
      memoryUsage: this.collectMemoryUsage(),
    }

    await fs.ensureDir(path.dirname(outputPath))
    await fs.writeJSON(outputPath, data, { spaces: 2 })

    return outputPath
  }
}
