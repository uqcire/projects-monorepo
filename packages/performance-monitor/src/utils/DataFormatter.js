export class DataFormatter {
  // 格式化字节数
  static formatBytes(bytes) {
    if (bytes === 0)
      return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`
  }

  // 格式化时间
  static formatTime(milliseconds) {
    if (milliseconds < 0)
      return 'N/A'
    if (milliseconds < 1000)
      return `${milliseconds}ms`
    if (milliseconds < 60000)
      return `${Math.round(milliseconds / 100) / 10}s`
    return `${Math.round(milliseconds / 6000) / 10}min`
  }

  // 格式化百分比
  static formatPercentage(value, total) {
    if (total === 0)
      return '0%'
    return `${Math.round((value / total) * 100)}%`
  }

  // 格式化数字
  static formatNumber(num) {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  // 格式化日期时间
  static formatDateTime(timestamp) {
    const date = new Date(timestamp)
    return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '')
  }

  // 格式化优先级颜色
  static getPriorityColor(priority) {
    switch (priority) {
      case 'high': return '#ff4757'
      case 'medium': return '#ffa502'
      case 'low': return '#2ed573'
      default: return '#747d8c'
    }
  }

  // 格式化优先级图标
  static getPriorityIcon(priority) {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  // 格式化表格数据
  static formatTableData(data, columns) {
    if (!Array.isArray(data))
      return []

    return data.map((row) => {
      const formattedRow = {}
      columns.forEach((col) => {
        let value = row[col.key]

        switch (col.type) {
          case 'bytes':
            value = this.formatBytes(value)
            break
          case 'time':
            value = this.formatTime(value)
            break
          case 'percentage':
            value = this.formatPercentage(value, col.total || 100)
            break
          case 'number':
            value = this.formatNumber(value)
            break
          case 'datetime':
            value = this.formatDateTime(value)
            break
          default:
            value = value?.toString() || 'N/A'
        }

        formattedRow[col.key] = value
      })
      return formattedRow
    })
  }

  // 生成摘要统计
  static generateSummaryStats(data, config) {
    const stats = {}

    Object.entries(config).forEach(([key, options]) => {
      const values = data.map(item => item[key]).filter(val => val != null)

      if (values.length === 0) {
        stats[key] = { min: 0, max: 0, avg: 0, total: 0, count: 0 }
        return
      }

      const numericValues = values.map(v => typeof v === 'number' ? v : Number.parseFloat(v) || 0)

      stats[key] = {
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        avg: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
        total: numericValues.reduce((sum, val) => sum + val, 0),
        count: values.length,
      }

      // 应用格式化
      if (options.format) {
        Object.keys(stats[key]).forEach((statKey) => {
          if (typeof stats[key][statKey] === 'number') {
            switch (options.format) {
              case 'bytes':
                stats[key][statKey] = this.formatBytes(stats[key][statKey])
                break
              case 'time':
                stats[key][statKey] = this.formatTime(stats[key][statKey])
                break
              case 'number':
                stats[key][statKey] = this.formatNumber(stats[key][statKey])
                break
            }
          }
        })
      }
    })

    return stats
  }

  // 创建趋势数据
  static createTrendData(historicalData, currentData, metric) {
    const trends = []

    if (historicalData && Array.isArray(historicalData)) {
      const sortedHistory = historicalData
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(-10) // 最近10个数据点

      sortedHistory.forEach((dataPoint) => {
        const value = this.getNestedValue(dataPoint, metric)
        if (value != null) {
          trends.push({
            timestamp: dataPoint.timestamp,
            value: typeof value === 'number' ? value : Number.parseFloat(value) || 0,
          })
        }
      })
    }

    // 添加当前数据点
    const currentValue = this.getNestedValue(currentData, metric)
    if (currentValue != null) {
      trends.push({
        timestamp: currentData.timestamp || new Date().toISOString(),
        value: typeof currentValue === 'number' ? currentValue : Number.parseFloat(currentValue) || 0,
      })
    }

    return trends
  }

  // 获取嵌套对象的值
  static getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // 生成健康度评分颜色
  static getHealthScoreColor(score) {
    if (score >= 80)
      return '#2ed573' // 绿色
    if (score >= 60)
      return '#ffa502' // 橙色
    if (score >= 40)
      return '#ff6348' // 红橙色
    return '#ff4757' // 红色
  }

  // 生成健康度评分等级
  static getHealthScoreGrade(score) {
    if (score >= 90)
      return 'A+'
    if (score >= 80)
      return 'A'
    if (score >= 70)
      return 'B+'
    if (score >= 60)
      return 'B'
    if (score >= 50)
      return 'C+'
    if (score >= 40)
      return 'C'
    if (score >= 30)
      return 'D'
    return 'F'
  }

  // 格式化建议列表
  static formatRecommendations(recommendations) {
    if (!Array.isArray(recommendations))
      return []

    return recommendations.map(rec => ({
      ...rec,
      icon: this.getPriorityIcon(rec.priority),
      color: this.getPriorityColor(rec.priority),
      priorityText: rec.priority.toUpperCase(),
    }))
  }
}
