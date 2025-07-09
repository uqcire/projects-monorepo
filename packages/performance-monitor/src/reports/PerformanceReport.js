import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import chalk from 'chalk'

import { DataFormatter } from '../utils/DataFormatter.js'

export class PerformanceReport {
  constructor(analysisData) {
    this.data = analysisData
  }

  async generate(outputDir = './performance-reports') {
    console.log(chalk.blue('📊 生成综合性能报告...'))

    // 确保输出目录存在
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // 生成JSON报告
    const jsonReport = this.generateJSONReport()
    const jsonPath = join(outputDir, 'performance-report.json')
    writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2))

    // 生成HTML报告
    const htmlReport = this.generateHTMLReport(jsonReport)
    const htmlPath = join(outputDir, 'performance-report.html')
    writeFileSync(htmlPath, htmlReport)

    // 生成控制台报告
    this.printConsoleReport(jsonReport)

    console.log(chalk.green(`✅ 性能报告已生成:`))
    console.log(chalk.gray(`   JSON: ${jsonPath}`))
    console.log(chalk.gray(`   HTML: ${htmlPath}`))

    return {
      json: jsonPath,
      html: htmlPath,
      data: jsonReport,
    }
  }

  generateJSONReport() {
    const report = {
      metadata: {
        title: '性能分析综合报告',
        generated: new Date().toISOString(),
        version: '1.0.0',
      },
      summary: {
        overallScore: this.calculateOverallScore(),
        bundle: this.formatBundleSummary(),
        dependencies: this.formatDependenciesSummary(),
        build: this.formatBuildSummary(),
        runtime: this.formatRuntimeSummary(),
      },
      recommendations: this.aggregateRecommendations(),
      details: {
        bundle: this.data?.bundle || null,
        dependencies: this.data?.dependencies || null,
        build: this.data?.build || null,
        runtime: this.data?.runtime || null,
      },
    }

    return report
  }

  calculateOverallScore() {
    let totalScore = 0
    let scoreCount = 0

    // 依赖健康度评分
    if (this.data?.dependencies?.analysis?.healthScore != null) {
      totalScore += this.data.dependencies.analysis.healthScore
      scoreCount++
    }

    // 打包体积评分（基于大小）
    if (this.data?.bundle?.analysis?.dist?.totalSize != null) {
      const bundleSize = this.data.bundle.analysis.dist.totalSize
      let bundleScore = 100
      if (bundleSize > 10 * 1024 * 1024)
        bundleScore = 60 // 大于10MB
      else if (bundleSize > 5 * 1024 * 1024)
        bundleScore = 75 // 大于5MB
      else if (bundleSize > 2 * 1024 * 1024)
        bundleScore = 85 // 大于2MB

      totalScore += bundleScore
      scoreCount++
    }

    // 构建时间评分
    if (this.data?.build?.analysis?.parallelBuildTime != null) {
      const buildTime = this.data.build.analysis.parallelBuildTime
      let buildScore = 100
      if (buildTime > 300000)
        buildScore = 60 // 大于5分钟
      else if (buildTime > 120000)
        buildScore = 75 // 大于2分钟
      else if (buildTime > 60000)
        buildScore = 85 // 大于1分钟

      totalScore += buildScore
      scoreCount++
    }

    return scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0
  }

  formatBundleSummary() {
    if (!this.data?.bundle?.analysis) {
      return { status: 'no-data', message: '无打包数据' }
    }

    const analysis = this.data.bundle.analysis
    const dist = analysis.dist

    if (!dist) {
      return { status: 'no-dist', message: '未找到dist目录' }
    }

    return {
      status: 'analyzed',
      totalSize: DataFormatter.formatBytes(dist.totalSize),
      fileCount: dist.totalFiles,
      recommendations: this.data.bundle.recommendations?.length || 0,
    }
  }

  formatDependenciesSummary() {
    if (!this.data?.dependencies?.analysis) {
      return { status: 'no-data', message: '无依赖数据' }
    }

    const analysis = this.data.dependencies.analysis

    if (analysis.type === 'workspace') {
      return {
        status: 'workspace',
        projects: analysis.projects?.length || 0,
        dependencies: Object.keys(analysis.globalDependencies || {}).length,
        duplicates: analysis.duplicates?.length || 0,
        conflicts: analysis.versionConflicts?.length || 0,
        healthScore: analysis.healthScore || 0,
      }
    }
    else {
      return {
        status: 'single',
        dependencies: analysis.project?.dependencyCount?.dependencies || 0,
        devDependencies: analysis.project?.dependencyCount?.devDependencies || 0,
        healthScore: analysis.healthScore || 0,
      }
    }
  }

  formatBuildSummary() {
    if (!this.data?.build?.analysis) {
      return { status: 'no-data', message: '无构建数据' }
    }

    const analysis = this.data.build.analysis

    if (analysis.type === 'workspace') {
      return {
        status: 'workspace',
        projects: analysis.projects?.length || 0,
        serialTime: DataFormatter.formatTime(analysis.serialBuildTime || 0),
        parallelTime: DataFormatter.formatTime(analysis.parallelBuildTime || 0),
        efficiency: analysis.efficiency || 0,
        bottlenecks: analysis.bottlenecks?.length || 0,
      }
    }
    else {
      return {
        status: 'single',
        hasBuildScript: analysis.hasBuildScript,
        buildTime: analysis.buildTime ? DataFormatter.formatTime(analysis.buildTime) : 'N/A',
      }
    }
  }

  formatRuntimeSummary() {
    if (!this.data?.runtime?.analysis) {
      return { status: 'no-data', message: '无运行时数据' }
    }

    const analysis = this.data.runtime.analysis

    return {
      status: 'analyzed',
      platform: analysis.systemMetrics?.platform || 'unknown',
      nodeVersion: analysis.systemMetrics?.nodeVersion || 'unknown',
      memoryUsage: `${analysis.systemMetrics?.memoryUsagePercent || 0}%`,
      heapUsage: `${analysis.memoryUsage?.heapUsagePercent || 0}%`,
    }
  }

  aggregateRecommendations() {
    const allRecommendations = []

    // 收集所有模块的建议
    if (this.data?.bundle?.recommendations) {
      allRecommendations.push(...this.data.bundle.recommendations.map(rec => ({ ...rec, module: 'bundle' })))
    }

    if (this.data?.dependencies?.recommendations) {
      allRecommendations.push(...this.data.dependencies.recommendations.map(rec => ({ ...rec, module: 'dependencies' })))
    }

    if (this.data?.build?.recommendations) {
      allRecommendations.push(...this.data.build.recommendations.map(rec => ({ ...rec, module: 'build' })))
    }

    if (this.data?.runtime?.recommendations) {
      allRecommendations.push(...this.data.runtime.recommendations.map(rec => ({ ...rec, module: 'runtime' })))
    }

    // 按优先级排序
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return allRecommendations.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 0
      const priorityB = priorityOrder[b.priority] || 0
      return priorityB - priorityA
    })
  }

  generateHTMLReport(data) {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.metadata.title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .score-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 8px solid rgba(255,255,255,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto;
            font-size: 2.5em;
            font-weight: bold;
            background: rgba(255,255,255,0.1);
        }
        .content {
            padding: 30px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .summary-card h3 {
            margin-top: 0;
            color: #4a5568;
        }
        .recommendations {
            background: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }
        .recommendation {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
            padding: 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #f56565;
        }
        .recommendation.medium {
            border-left-color: #ed8936;
        }
        .recommendation.low {
            border-left-color: #48bb78;
        }
        .recommendation-module {
            background: #e2e8f0;
            color: #4a5568;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75em;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${data.metadata.title}</h1>
            <div class="score-circle" style="color: ${DataFormatter.getHealthScoreColor(data.summary.overallScore)}">
                ${data.summary.overallScore}
            </div>
            <p>综合评分等级: ${DataFormatter.getHealthScoreGrade(data.summary.overallScore)}</p>
            <p>生成时间: ${DataFormatter.formatDateTime(data.metadata.generated)}</p>
        </div>

        <div class="content">
            <div class="summary-grid">
                ${this.generateSummaryCardHTML('📦 打包分析', data.summary.bundle)}
                ${this.generateSummaryCardHTML('📦 依赖分析', data.summary.dependencies)}
                ${this.generateSummaryCardHTML('⚡ 构建分析', data.summary.build)}
                ${this.generateSummaryCardHTML('🖥️ 运行时分析', data.summary.runtime)}
            </div>

            ${this.generateRecommendationsHTML(data.recommendations)}
        </div>
    </div>
</body>
</html>`
  }

  generateSummaryCardHTML(title, summary) {
    let content = ''

    if (summary.status === 'no-data') {
      content = `<p>❌ ${summary.message}</p>`
    }
    else if (summary.status === 'analyzed' || summary.status === 'workspace' || summary.status === 'single') {
      content = Object.entries(summary)
        .filter(([key]) => key !== 'status' && key !== 'message')
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('')
    }

    return `
      <div class="summary-card">
          <h3>${title}</h3>
          ${content}
      </div>
    `
  }

  generateRecommendationsHTML(recommendations) {
    if (!recommendations || recommendations.length === 0) {
      return '<div class="recommendations"><p>暂无优化建议</p></div>'
    }

    const items = recommendations.map(rec => `
      <div class="recommendation ${rec.priority}">
          <div class="recommendation-module">${rec.module}</div>
          <div style="flex: 1;">
              <strong>[${rec.type}]</strong> ${rec.message}
          </div>
      </div>
    `).join('')

    return `
      <div class="recommendations">
          <h2>💡 优化建议</h2>
          ${items}
      </div>
    `
  }

  printConsoleReport(data) {
    console.log(`\n${chalk.bold.blue('📊 性能分析综合报告')}`)
    console.log(chalk.gray('='.repeat(60)))

    // 总体评分
    const scoreColor = data.summary.overallScore >= 80
      ? 'green'
      : data.summary.overallScore >= 60 ? 'yellow' : 'red'
    console.log(chalk.bold(`\n🏆 综合评分: ${chalk[scoreColor](data.summary.overallScore)} (${DataFormatter.getHealthScoreGrade(data.summary.overallScore)})`))

    // 各模块摘要
    console.log(chalk.bold('\n📋 模块摘要:'))

    console.log(chalk.bold('\n  📦 打包分析:'))
    if (data.summary.bundle.status === 'analyzed') {
      console.log(`     总体积: ${chalk.cyan(data.summary.bundle.totalSize)}`)
      console.log(`     文件数: ${chalk.cyan(data.summary.bundle.fileCount)}`)
    }
    else {
      console.log(`     ${chalk.gray(data.summary.bundle.message || '无数据')}`)
    }

    console.log(chalk.bold('\n  📦 依赖分析:'))
    if (data.summary.dependencies.status !== 'no-data') {
      console.log(`     健康评分: ${chalk.cyan(data.summary.dependencies.healthScore)}`)
      if (data.summary.dependencies.status === 'workspace') {
        console.log(`     项目数: ${chalk.cyan(data.summary.dependencies.projects)}`)
        console.log(`     重复依赖: ${chalk.cyan(data.summary.dependencies.duplicates)}`)
      }
    }
    else {
      console.log(`     ${chalk.gray(data.summary.dependencies.message || '无数据')}`)
    }

    // 优化建议（只显示高优先级）
    const highPriorityRecs = data.recommendations.filter(rec => rec.priority === 'high')
    if (highPriorityRecs.length > 0) {
      console.log(chalk.bold('\n🚨 高优先级建议:'))
      highPriorityRecs.slice(0, 5).forEach((rec, index) => {
        console.log(`  ${index + 1}. [${chalk.red(rec.module)}] ${rec.message}`)
      })
    }

    console.log(chalk.gray(`\n${'='.repeat(60)}`))
  }
}
