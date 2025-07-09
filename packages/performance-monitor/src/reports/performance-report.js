/**
 * 性能报告生成器
 */
export class PerformanceReport {
  async generate(analysisResults) {
    return {
      title: '🚀 性能分析综合报告',
      timestamp: new Date().toISOString(),
      overview: this.generateOverview(analysisResults),
      sections: this.generateSections(analysisResults),
      recommendations: this.aggregateRecommendations(analysisResults),
    }
  }

  generateOverview(results) {
    return {
      analysisTime: results.timestamp,
      componentsAnalyzed: Object.keys(results).filter(k => k !== 'timestamp').length,
      totalRecommendations: this.aggregateRecommendations(results).length,
    }
  }

  generateSections(results) {
    const sections = {}

    if (results.bundle) {
      sections.bundle = {
        title: '打包分析',
        status: results.bundle.warnings?.length > 0 ? 'warning' : 'success',
        summary: results.bundle.summary,
      }
    }

    if (results.dependencies) {
      sections.dependencies = {
        title: '依赖分析',
        status: results.dependencies.duplicates?.length > 5 ? 'warning' : 'success',
        summary: results.dependencies.summary,
      }
    }

    return sections
  }

  aggregateRecommendations(results) {
    const allRecs = []

    Object.values(results).forEach((result) => {
      if (result && result.recommendations) {
        allRecs.push(...result.recommendations)
      }
    })

    return allRecs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
    })
  }
}
