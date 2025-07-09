/**
 * 打包报告生成器
 */
export class BundleReport {
  constructor(options = {}) {
    this.options = {
      format: 'json',
      includeDetails: true,
      ...options,
    }
  }

  /**
   * 生成打包分析报告
   * @param {object} analysisResults - 分析结果
   * @returns {object} 格式化的报告
   */
  async generate(analysisResults) {
    const report = {
      title: '📦 打包体积分析报告',
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(analysisResults),
      details: this.options.includeDetails ? this.generateDetails(analysisResults) : null,
      recommendations: analysisResults.recommendations || [],
    }

    return report
  }

  generateSummary(results) {
    return {
      totalSize: results.summary?.humanTotalSize || 'N/A',
      fileCount: results.summary?.totalFiles || 0,
      analysisTime: results.analysisTime || 'N/A',
      status: results.warnings?.length > 0 ? 'warning' : 'success',
    }
  }

  generateDetails(results) {
    return {
      files: results.files || [],
      assets: results.assets || {},
      warnings: results.warnings || [],
    }
  }
}
