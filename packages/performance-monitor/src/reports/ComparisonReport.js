import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import chalk from 'chalk'

import { DataFormatter } from '../utils/DataFormatter.js'

export class ComparisonReport {
  constructor(currentData, historicalData = []) {
    this.currentData = currentData
    this.historicalData = Array.isArray(historicalData) ? historicalData : []
  }

  async generate(outputDir = './performance-reports') {
    console.log(chalk.blue('📊 生成性能对比报告...'))

    // 确保输出目录存在
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // 生成JSON报告
    const jsonReport = this.generateJSONReport()
    const jsonPath = join(outputDir, 'comparison-report.json')
    writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2))

    // 生成控制台报告
    this.printConsoleReport(jsonReport)

    console.log(chalk.green(`✅ 对比报告已生成: ${jsonPath}`))

    return {
      json: jsonPath,
      data: jsonReport,
    }
  }

  generateJSONReport() {
    const report = {
      metadata: {
        title: '性能对比报告',
        generated: new Date().toISOString(),
        version: '1.0.0',
        historicalDataPoints: this.historicalData.length,
      },
      comparison: {
        bundle: this.compareBundleData(),
        dependencies: this.compareDependencyData(),
        build: this.compareBuildData(),
      },
      trends: {
        bundleSize: this.createTrend('bundle.analysis.dist.totalSize'),
        dependencyHealth: this.createTrend('dependencies.analysis.healthScore'),
        buildTime: this.createTrend('build.analysis.parallelBuildTime'),
      },
      insights: this.generateInsights(),
    }

    return report
  }

  compareBundleData() {
    const current = this.currentData?.bundle?.analysis?.dist?.totalSize
    const previous = this.getLastValue('bundle.analysis.dist.totalSize')

    if (!current) {
      return { status: 'no-data', message: '当前无打包数据' }
    }

    if (!previous) {
      return {
        status: 'baseline',
        current: DataFormatter.formatBytes(current),
        message: '首次测量，建立基准线',
      }
    }

    const change = current - previous
    const changePercent = Math.round((change / previous) * 100)

    return {
      status: 'compared',
      current: DataFormatter.formatBytes(current),
      previous: DataFormatter.formatBytes(previous),
      change: DataFormatter.formatBytes(Math.abs(change)),
      changePercent,
      trend: change > 0 ? 'increased' : change < 0 ? 'decreased' : 'stable',
      recommendation: this.getBundleSizeRecommendation(changePercent),
    }
  }

  compareDependencyData() {
    const current = this.currentData?.dependencies?.analysis?.healthScore
    const previous = this.getLastValue('dependencies.analysis.healthScore')

    if (!current) {
      return { status: 'no-data', message: '当前无依赖数据' }
    }

    if (!previous) {
      return {
        status: 'baseline',
        current,
        grade: DataFormatter.getHealthScoreGrade(current),
        message: '首次测量，建立基准线',
      }
    }

    const change = current - previous

    return {
      status: 'compared',
      current,
      currentGrade: DataFormatter.getHealthScoreGrade(current),
      previous,
      previousGrade: DataFormatter.getHealthScoreGrade(previous),
      change: Math.abs(change),
      trend: change > 0 ? 'improved' : change < 0 ? 'degraded' : 'stable',
      recommendation: this.getDependencyHealthRecommendation(change),
    }
  }

  compareBuildData() {
    const currentParallel = this.currentData?.build?.analysis?.parallelBuildTime
    const previousParallel = this.getLastValue('build.analysis.parallelBuildTime')

    if (!currentParallel) {
      return { status: 'no-data', message: '当前无构建数据' }
    }

    if (!previousParallel) {
      return {
        status: 'baseline',
        current: DataFormatter.formatTime(currentParallel),
        message: '首次测量，建立基准线',
      }
    }

    const change = currentParallel - previousParallel
    const changePercent = Math.round((change / previousParallel) * 100)

    return {
      status: 'compared',
      current: DataFormatter.formatTime(currentParallel),
      previous: DataFormatter.formatTime(previousParallel),
      change: DataFormatter.formatTime(Math.abs(change)),
      changePercent: Math.abs(changePercent),
      trend: change > 0 ? 'slower' : change < 0 ? 'faster' : 'stable',
      recommendation: this.getBuildTimeRecommendation(changePercent),
    }
  }

  createTrend(metricPath) {
    const trend = DataFormatter.createTrendData(this.historicalData, this.currentData, metricPath)

    if (trend.length < 2) {
      return { status: 'insufficient-data', dataPoints: trend.length }
    }

    // 计算趋势方向
    const first = trend[0].value
    const last = trend[trend.length - 1].value
    const direction = last > first ? 'increasing' : last < first ? 'decreasing' : 'stable'

    // 计算变化率
    const changeRate = first !== 0 ? ((last - first) / first) * 100 : 0

    return {
      status: 'available',
      dataPoints: trend.length,
      direction,
      changeRate: Math.round(changeRate * 100) / 100,
      firstValue: first,
      lastValue: last,
      data: trend,
    }
  }

  getLastValue(path) {
    if (this.historicalData.length === 0)
      return null

    const lastData = this.historicalData[this.historicalData.length - 1]
    return DataFormatter.getNestedValue(lastData, path)
  }

  getBundleSizeRecommendation(changePercent) {
    if (Math.abs(changePercent) < 5) {
      return { type: 'info', message: '打包体积变化在正常范围内' }
    }

    if (changePercent > 20) {
      return { type: 'warning', message: '打包体积显著增加，建议检查新增资源' }
    }

    if (changePercent > 10) {
      return { type: 'caution', message: '打包体积有所增加，需要关注' }
    }

    if (changePercent < -10) {
      return { type: 'positive', message: '打包体积显著减少，优化效果良好' }
    }

    return { type: 'info', message: '打包体积变化较小' }
  }

  getDependencyHealthRecommendation(change) {
    if (Math.abs(change) < 5) {
      return { type: 'info', message: '依赖健康度保持稳定' }
    }

    if (change > 10) {
      return { type: 'positive', message: '依赖健康度显著改善' }
    }

    if (change > 0) {
      return { type: 'positive', message: '依赖健康度有所改善' }
    }

    if (change < -10) {
      return { type: 'warning', message: '依赖健康度显著下降，需要立即处理' }
    }

    return { type: 'caution', message: '依赖健康度有所下降，建议关注' }
  }

  getBuildTimeRecommendation(changePercent) {
    if (changePercent < 5) {
      return { type: 'info', message: '构建时间变化较小' }
    }

    if (changePercent > 25) {
      return { type: 'warning', message: '构建时间显著增长，需要优化' }
    }

    if (changePercent > 10) {
      return { type: 'caution', message: '构建时间有所增长，建议关注' }
    }

    return { type: 'info', message: '构建时间变化在正常范围内' }
  }

  generateInsights() {
    const insights = []

    // 基于趋势数据生成洞察
    const bundleTrend = this.createTrend('bundle.analysis.dist.totalSize')
    if (bundleTrend.status === 'available' && Math.abs(bundleTrend.changeRate) > 15) {
      insights.push({
        type: bundleTrend.direction === 'increasing' ? 'concern' : 'positive',
        title: '打包体积趋势',
        message: `过去 ${bundleTrend.dataPoints} 次测量中，打包体积${bundleTrend.direction === 'increasing' ? '持续增长' : '持续减少'} ${Math.abs(bundleTrend.changeRate).toFixed(1)}%`,
      })
    }

    const healthTrend = this.createTrend('dependencies.analysis.healthScore')
    if (healthTrend.status === 'available' && Math.abs(healthTrend.changeRate) > 10) {
      insights.push({
        type: healthTrend.direction === 'decreasing' ? 'concern' : 'positive',
        title: '依赖健康度趋势',
        message: `依赖健康度在过去的测量中${healthTrend.direction === 'increasing' ? '持续改善' : '持续下降'}`,
      })
    }

    const buildTrend = this.createTrend('build.analysis.parallelBuildTime')
    if (buildTrend.status === 'available' && Math.abs(buildTrend.changeRate) > 20) {
      insights.push({
        type: buildTrend.direction === 'increasing' ? 'concern' : 'positive',
        title: '构建时间趋势',
        message: `构建时间${buildTrend.direction === 'increasing' ? '持续增长' : '持续优化'} ${Math.abs(buildTrend.changeRate).toFixed(1)}%`,
      })
    }

    // 如果没有足够的历史数据
    if (this.historicalData.length < 2) {
      insights.push({
        type: 'info',
        title: '数据积累',
        message: '继续收集性能数据以获得更深入的趋势分析',
      })
    }

    return insights
  }

  printConsoleReport(data) {
    console.log(`\n${chalk.bold.blue('📈 性能对比报告')}`)
    console.log(chalk.gray('='.repeat(50)))

    // 打包体积对比
    const bundle = data.comparison.bundle
    if (bundle.status === 'compared') {
      console.log(chalk.bold('\n📦 打包体积对比:'))
      console.log(`  当前: ${chalk.cyan(bundle.current)}`)
      console.log(`  之前: ${chalk.gray(bundle.previous)}`)

      const trendColor = bundle.trend === 'increased' ? 'red' : bundle.trend === 'decreased' ? 'green' : 'gray'
      const trendIcon = bundle.trend === 'increased' ? '📈' : bundle.trend === 'decreased' ? '📉' : '➡️'
      console.log(`  变化: ${trendIcon} ${chalk[trendColor](bundle.change)} (${bundle.changePercent > 0 ? '+' : ''}${bundle.changePercent}%)`)
    }

    // 依赖健康度对比
    const deps = data.comparison.dependencies
    if (deps.status === 'compared') {
      console.log(chalk.bold('\n📦 依赖健康度对比:'))
      console.log(`  当前: ${chalk.cyan(deps.current)} (${deps.currentGrade})`)
      console.log(`  之前: ${chalk.gray(deps.previous)} (${deps.previousGrade})`)

      const trendColor = deps.trend === 'improved' ? 'green' : deps.trend === 'degraded' ? 'red' : 'gray'
      const trendIcon = deps.trend === 'improved' ? '📈' : deps.trend === 'degraded' ? '📉' : '➡️'
      console.log(`  变化: ${trendIcon} ${chalk[trendColor](deps.change)} 分`)
    }

    // 构建时间对比
    const build = data.comparison.build
    if (build.status === 'compared') {
      console.log(chalk.bold('\n⚡ 构建时间对比:'))
      console.log(`  当前: ${chalk.cyan(build.current)}`)
      console.log(`  之前: ${chalk.gray(build.previous)}`)

      const trendColor = build.trend === 'slower' ? 'red' : build.trend === 'faster' ? 'green' : 'gray'
      const trendIcon = build.trend === 'slower' ? '📈' : build.trend === 'faster' ? '📉' : '➡️'
      console.log(`  变化: ${trendIcon} ${chalk[trendColor](build.change)} (${build.changePercent}%)`)
    }

    // 洞察
    if (data.insights.length > 0) {
      console.log(chalk.bold('\n💡 趋势洞察:'))
      data.insights.forEach((insight, index) => {
        const icon = insight.type === 'positive' ? '✅' : insight.type === 'concern' ? '⚠️' : 'ℹ️'
        console.log(`  ${index + 1}. ${icon} ${chalk.bold(insight.title)}: ${insight.message}`)
      })
    }

    console.log(chalk.gray(`\n${'='.repeat(50)}`))
  }
}
