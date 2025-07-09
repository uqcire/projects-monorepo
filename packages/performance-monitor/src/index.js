import { BuildTimeAnalyzer } from './analyzers/BuildTimeAnalyzer.js'
import { BundleAnalyzer } from './analyzers/BundleAnalyzer.js'
import { DependencyAnalyzer } from './analyzers/DependencyAnalyzer.js'
import { RuntimeAnalyzer } from './analyzers/RuntimeAnalyzer.js'

import { BundleReport } from './reports/BundleReport.js'
import { ComparisonReport } from './reports/ComparisonReport.js'
import { PerformanceReport } from './reports/PerformanceReport.js'

import { DataFormatter } from './utils/DataFormatter.js'
import { MetricsCollector } from './utils/MetricsCollector.js'

// 导出所有分析器
export {
  BuildTimeAnalyzer,
  BundleAnalyzer,
  DependencyAnalyzer,
  RuntimeAnalyzer,
}

// 导出所有报告生成器
export {
  BundleReport,
  ComparisonReport,
  PerformanceReport,
}

// 导出工具类
export {
  DataFormatter,
  MetricsCollector,
}

// 导出便捷函数
export async function analyzeAll(projectPath = '.') {
  const bundleAnalyzer = new BundleAnalyzer(projectPath)
  const depAnalyzer = new DependencyAnalyzer(projectPath)
  const buildAnalyzer = new BuildTimeAnalyzer(projectPath)
  const runtimeAnalyzer = new RuntimeAnalyzer(projectPath)

  const [bundleResults, depResults, buildResults, runtimeResults] = await Promise.all([
    bundleAnalyzer.analyze(),
    depAnalyzer.analyze(),
    buildAnalyzer.analyze(),
    runtimeAnalyzer.analyze(),
  ])

  return {
    bundle: bundleResults,
    dependencies: depResults,
    build: buildResults,
    runtime: runtimeResults,
  }
}

export async function generateAllReports(analysisData, outputDir = './performance-reports') {
  const bundleReport = new BundleReport(analysisData.bundle)
  const perfReport = new PerformanceReport(analysisData)
  const comparisonReport = new ComparisonReport(analysisData)

  await Promise.all([
    bundleReport.generate(outputDir),
    perfReport.generate(outputDir),
    comparisonReport.generate(outputDir),
  ])

  return {
    bundleReport: `${outputDir}/bundle-analysis.json`,
    performanceReport: `${outputDir}/performance-report.json`,
    comparisonReport: `${outputDir}/comparison-report.json`,
  }
}
