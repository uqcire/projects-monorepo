import process from 'node:process'

export class MetricsCollector {
  constructor() {
    this.timers = new Map()
    this.counters = new Map()
    this.measurements = new Map()
  }

  // 计时器功能
  startTimer(name) {
    this.timers.set(name, Date.now())
  }

  endTimer(name) {
    const startTime = this.timers.get(name)
    if (!startTime) {
      throw new Error(`Timer '${name}' was not started`)
    }

    const duration = Date.now() - startTime
    this.timers.delete(name)

    // 存储测量结果
    if (!this.measurements.has('timers')) {
      this.measurements.set('timers', {})
    }
    this.measurements.get('timers')[name] = duration

    return duration
  }

  // 计数器功能
  incrementCounter(name, value = 1) {
    const current = this.counters.get(name) || 0
    this.counters.set(name, current + value)
  }

  getCounter(name) {
    return this.counters.get(name) || 0
  }

  resetCounter(name) {
    this.counters.set(name, 0)
  }

  // 测量功能
  recordMeasurement(category, name, value, unit = '') {
    if (!this.measurements.has(category)) {
      this.measurements.set(category, {})
    }

    this.measurements.get(category)[name] = {
      value,
      unit,
      timestamp: Date.now(),
    }
  }

  // 文件大小测量
  recordFileSize(filename, size) {
    this.recordMeasurement('fileSize', filename, size, 'bytes')
  }

  // 内存测量
  recordMemoryUsage(stage) {
    const memUsage = process.memoryUsage()
    this.recordMeasurement('memory', stage, {
      rss: memUsage.rss,
      heapTotal: memUsage.heapTotal,
      heapUsed: memUsage.heapUsed,
      external: memUsage.external,
    }, 'bytes')
  }

  // 获取所有指标
  getAllMetrics() {
    return {
      timers: Object.fromEntries(this.measurements.get('timers') || {}),
      counters: Object.fromEntries(this.counters),
      measurements: Object.fromEntries(
        Array.from(this.measurements.entries()).map(([key, value]) => [
          key,
          key === 'timers' ? value : Object.fromEntries(Object.entries(value)),
        ]),
      ),
    }
  }

  // 清理所有指标
  reset() {
    this.timers.clear()
    this.counters.clear()
    this.measurements.clear()
  }

  // 导出指标为JSON
  exportMetrics() {
    return JSON.stringify(this.getAllMetrics(), null, 2)
  }

  // 格式化字节数
  formatBytes(bytes) {
    if (bytes === 0)
      return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`
  }

  // 格式化时间
  formatTime(milliseconds) {
    if (milliseconds < 1000)
      return `${milliseconds}ms`
    if (milliseconds < 60000)
      return `${Math.round(milliseconds / 100) / 10}s`
    return `${Math.round(milliseconds / 6000) / 10}min`
  }
}
