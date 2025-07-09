/**
 * 对比报告生成器
 */
export class ComparisonReport {
  async generate(currentResults, previousResults = null) {
    return {
      title: '📊 性能对比报告',
      timestamp: new Date().toISOString(),
      current: this.formatResults(currentResults),
      previous: previousResults ? this.formatResults(previousResults) : null,
      comparison: previousResults ? this.generateComparison(currentResults, previousResults) : null,
      trends: this.analyzeTrends(currentResults, previousResults),
    }
  }

  formatResults(results) {
    return {
      timestamp: results.timestamp,
      bundleSize: results.bundle?.summary?.totalSize || 0,
      dependencyCount: results.dependencies?.summary?.uniqueDependencies || 0,
      buildTime: results.buildTime?.summary?.averageBuildTime?.time || 0,
    }
  }

  generateComparison(current, previous) {
    const currentData = this.formatResults(current)
    const previousData = this.formatResults(previous)

    return {
      bundleSize: {
        change: currentData.bundleSize - previousData.bundleSize,
        percentage: previousData.bundleSize > 0
          ? ((currentData.bundleSize - previousData.bundleSize) / previousData.bundleSize * 100).toFixed(1)
          : '0',
      },
      dependencyCount: {
        change: currentData.dependencyCount - previousData.dependencyCount,
        percentage: previousData.dependencyCount > 0
          ? ((currentData.dependencyCount - previousData.dependencyCount) / previousData.dependencyCount * 100).toFixed(1)
          : '0',
      },
    }
  }

  analyzeTrends(current, previous) {
    if (!previous) {
      return { status: 'baseline', message: '这是第一次分析，建立基准数据' }
    }

    const comparison = this.generateComparison(current, previous)
    const bundleIncrease = Number.parseFloat(comparison.bundleSize.percentage) > 10
    const depsIncrease = Number.parseFloat(comparison.dependencyCount.percentage) > 5

    if (bundleIncrease || depsIncrease) {
      return {
        status: 'regression',
        message: '检测到性能回归，建议进行优化',
      }
    }

    return {
      status: 'stable',
      message: '性能指标保持稳定',
    }
  }
}
