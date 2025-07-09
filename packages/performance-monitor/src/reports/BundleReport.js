import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import chalk from 'chalk'

import { DataFormatter } from '../utils/DataFormatter.js'

export class BundleReport {
  constructor(bundleData) {
    this.data = bundleData
  }

  async generate(outputDir = './performance-reports') {
    console.log(chalk.blue('📊 生成打包分析报告...'))

    // 确保输出目录存在
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // 生成JSON报告
    const jsonReport = this.generateJSONReport()
    const jsonPath = join(outputDir, 'bundle-analysis.json')
    writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2))

    // 生成HTML报告
    const htmlReport = this.generateHTMLReport(jsonReport)
    const htmlPath = join(outputDir, 'bundle-analysis.html')
    writeFileSync(htmlPath, htmlReport)

    // 生成控制台报告
    this.printConsoleReport(jsonReport)

    console.log(chalk.green(`✅ 打包报告已生成:`))
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
        title: '打包分析报告',
        generated: new Date().toISOString(),
        projectPath: this.data?.projectPath || '.',
        version: '1.0.0',
      },
      summary: {
        totalSize: 0,
        fileCount: 0,
        largestFiles: [],
        assetBreakdown: {},
        recommendations: [],
      },
      details: {
        directories: {},
        fileTypes: {},
        assets: {},
      },
    }

    if (!this.data || !this.data.analysis) {
      report.summary.message = '没有可用的打包数据'
      return report
    }

    const { analysis } = this.data

    // 处理dist目录分析
    if (analysis.dist) {
      report.summary.totalSize = analysis.dist.totalSize
      report.summary.fileCount = analysis.dist.totalFiles
      report.summary.largestFiles = analysis.dist.largestFiles || []
      report.summary.assetBreakdown = this.formatAssetBreakdown(analysis.dist.assets)
      report.details.directories.dist = analysis.dist
    }

    // 处理src目录分析
    if (analysis.src) {
      report.details.directories.src = analysis.src
    }

    // 处理node_modules分析
    if (analysis.nodeModules) {
      report.details.directories.nodeModules = analysis.nodeModules
    }

    // 添加建议
    if (this.data.recommendations) {
      report.summary.recommendations = DataFormatter.formatRecommendations(this.data.recommendations)
    }

    return report
  }

  formatAssetBreakdown(assets) {
    if (!assets)
      return {}

    const breakdown = {}
    Object.entries(assets).forEach(([type, info]) => {
      breakdown[type] = {
        size: DataFormatter.formatBytes(info.size),
        count: info.count,
        percentage: info.size > 0 ? Math.round((info.size / Object.values(assets).reduce((sum, a) => sum + a.size, 0)) * 100) : 0,
      }
    })

    return breakdown
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
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section h2 {
            color: #4a5568;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            text-align: center;
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 5px;
        }
        .stat-label {
            color: #718096;
            font-size: 0.9em;
        }
        .chart-container {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .file-list {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        .file-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .file-item:last-child {
            border-bottom: none;
        }
        .recommendations {
            background: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 20px;
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
        .recommendation-icon {
            margin-right: 10px;
            font-size: 1.2em;
        }
        .recommendation-content {
            flex: 1;
        }
        .recommendation-priority {
            background: #f56565;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: bold;
            margin-left: 10px;
        }
        .recommendation-priority.medium {
            background: #ed8936;
        }
        .recommendation-priority.low {
            background: #48bb78;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${data.metadata.title}</h1>
            <p>生成时间: ${DataFormatter.formatDateTime(data.metadata.generated)}</p>
            <p>项目路径: ${data.metadata.projectPath}</p>
        </div>

        <div class="content">
            <div class="section">
                <h2>📊 概览统计</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${DataFormatter.formatBytes(data.summary.totalSize)}</div>
                        <div class="stat-label">总体积</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.summary.fileCount}</div>
                        <div class="stat-label">文件数量</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${Object.keys(data.summary.assetBreakdown).length}</div>
                        <div class="stat-label">资源类型</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.summary.recommendations.length}</div>
                        <div class="stat-label">优化建议</div>
                    </div>
                </div>
            </div>

            ${this.generateAssetBreakdownHTML(data.summary.assetBreakdown)}
            ${this.generateLargestFilesHTML(data.summary.largestFiles)}
            ${this.generateRecommendationsHTML(data.summary.recommendations)}
        </div>
    </div>
</body>
</html>`
  }

  generateAssetBreakdownHTML(assetBreakdown) {
    if (!assetBreakdown || Object.keys(assetBreakdown).length === 0) {
      return ''
    }

    const items = Object.entries(assetBreakdown)
      .filter(([, info]) => info.count > 0)
      .map(([type, info]) => `
        <div class="file-item">
            <span>${type.toUpperCase()}</span>
            <span>${info.size} (${info.count} 文件, ${info.percentage}%)</span>
        </div>
      `)
      .join('')

    return `
      <div class="section">
          <h2>📁 资源分类统计</h2>
          <div class="file-list">
              ${items}
          </div>
      </div>
    `
  }

  generateLargestFilesHTML(largestFiles) {
    if (!largestFiles || largestFiles.length === 0) {
      return ''
    }

    const items = largestFiles.slice(0, 10).map(file => `
      <div class="file-item">
          <span>${file.file}</span>
          <span>${file.size}</span>
      </div>
    `).join('')

    return `
      <div class="section">
          <h2>🔍 最大文件</h2>
          <div class="file-list">
              ${items}
          </div>
      </div>
    `
  }

  generateRecommendationsHTML(recommendations) {
    if (!recommendations || recommendations.length === 0) {
      return ''
    }

    const items = recommendations.map(rec => `
      <div class="recommendation ${rec.priority}">
          <div class="recommendation-icon">${rec.icon}</div>
          <div class="recommendation-content">
              <strong>[${rec.type}]</strong> ${rec.message}
          </div>
          <div class="recommendation-priority ${rec.priority}">${rec.priorityText}</div>
      </div>
    `).join('')

    return `
      <div class="section">
          <h2>💡 优化建议</h2>
          <div class="recommendations">
              ${items}
          </div>
      </div>
    `
  }

  printConsoleReport(data) {
    console.log(`\n${chalk.bold.blue('📦 打包分析报告')}`)
    console.log(chalk.gray('='.repeat(50)))

    console.log(chalk.bold('\n📊 基本信息:'))
    console.log(`  总体积: ${chalk.cyan(DataFormatter.formatBytes(data.summary.totalSize))}`)
    console.log(`  文件数量: ${chalk.cyan(data.summary.fileCount)}`)

    if (Object.keys(data.summary.assetBreakdown).length > 0) {
      console.log(chalk.bold('\n📁 资源分类:'))
      Object.entries(data.summary.assetBreakdown)
        .filter(([, info]) => info.count > 0)
        .forEach(([type, info]) => {
          console.log(`  ${type.toUpperCase()}: ${chalk.cyan(info.size)} (${info.count} 文件, ${info.percentage}%)`)
        })
    }

    if (data.summary.largestFiles.length > 0) {
      console.log(chalk.bold('\n🔍 最大文件 (前5个):'))
      data.summary.largestFiles.slice(0, 5).forEach((file, index) => {
        console.log(`  ${index + 1}. ${chalk.yellow(file.file)} - ${chalk.cyan(file.size)}`)
      })
    }

    if (data.summary.recommendations.length > 0) {
      console.log(chalk.bold('\n💡 优化建议:'))
      data.summary.recommendations.forEach((rec, index) => {
        const color = rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'yellow' : 'green'
        console.log(`  ${index + 1}. ${rec.icon} ${chalk[color](rec.message)}`)
      })
    }

    console.log(chalk.gray(`\n${'='.repeat(50)}`))
  }
}
