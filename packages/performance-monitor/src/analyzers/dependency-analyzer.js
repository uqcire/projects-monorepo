import path from 'node:path'
import fs from 'fs-extra'
import { glob } from 'glob'
import { MetricsCollector } from '../utils/metrics-collector.js'

/**
 * 依赖关系分析器 - 分析项目的依赖结构和重复依赖
 */
export class DependencyAnalyzer {
  constructor(options = {}) {
    this.options = {
      includeDevDependencies: false,
      detectDuplicates: true,
      analyzeVersions: true,
      ...options,
    }
    this.collector = new MetricsCollector()
  }

  /**
   * 分析指定项目的依赖关系
   * @param {string} projectPath - 项目路径
   * @returns {object} 分析结果
   */
  async analyze(projectPath = '.') {
    this.collector.startTimer('dependency-analysis')

    try {
      const results = {
        projectPath,
        timestamp: new Date().toISOString(),
        summary: {},
        dependencies: {},
        duplicates: [],
        outdated: [],
        vulnerabilities: [],
        recommendations: [],
      }

      // 收集所有package.json文件
      const packageFiles = await this.collectPackageFiles(projectPath)

      // 分析依赖结构
      const dependencyMap = await this.analyzeDependencies(packageFiles)
      results.dependencies = dependencyMap

      // 检测重复依赖
      if (this.options.detectDuplicates) {
        results.duplicates = this.detectDuplicateDependencies(dependencyMap)
      }

      // 分析版本信息
      if (this.options.analyzeVersions) {
        results.versionConflicts = this.analyzeVersionConflicts(dependencyMap)
      }

      // 生成摘要信息
      results.summary = this.generateSummary(dependencyMap, results.duplicates)

      // 生成优化建议
      results.recommendations = this.generateRecommendations(results)

      const analysisTime = this.collector.endTimer('dependency-analysis')
      results.analysisTime = `${analysisTime.toFixed(2)}ms`

      return results
    }
    catch (error) {
      this.collector.endTimer('dependency-analysis')
      throw new Error(`Dependency analysis failed: ${error.message}`)
    }
  }

  /**
   * 收集所有package.json文件
   * @param {string} projectPath - 项目根路径
   * @returns {Array} package.json文件列表
   */
  async collectPackageFiles(projectPath) {
    const packageFiles = []

    // 查找所有package.json文件
    const patterns = [
      'package.json',
      'packages/*/package.json',
      'packages/*/*/package.json',
      'apps/*/package.json',
    ]

    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: projectPath,
        ignore: ['**/node_modules/**'],
      })

      for (const match of matches) {
        const fullPath = path.join(projectPath, match)
        try {
          const content = await fs.readJSON(fullPath)
          packageFiles.push({
            path: match,
            fullPath,
            content,
            projectName: content.name || path.basename(path.dirname(match)),
          })
        }
        catch (error) {
          console.warn(`Failed to read ${fullPath}:`, error.message)
        }
      }
    }

    return packageFiles
  }

  /**
   * 分析依赖关系
   * @param {Array} packageFiles - package.json文件列表
   * @returns {object} 依赖关系映射
   */
  async analyzeDependencies(packageFiles) {
    const dependencyMap = {}

    for (const packageFile of packageFiles) {
      const { content, projectName, path: relativePath } = packageFile

      const projectDeps = {
        name: projectName,
        path: relativePath,
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
        allDependencies: {},
      }

      // 处理生产依赖
      if (content.dependencies) {
        projectDeps.dependencies = content.dependencies
        Object.assign(projectDeps.allDependencies, content.dependencies)
      }

      // 处理开发依赖
      if (content.devDependencies && this.options.includeDevDependencies) {
        projectDeps.devDependencies = content.devDependencies
        Object.assign(projectDeps.allDependencies, content.devDependencies)
      }

      // 处理对等依赖
      if (content.peerDependencies) {
        projectDeps.peerDependencies = content.peerDependencies
      }

      // 添加元数据
      projectDeps.metadata = {
        version: content.version || '0.0.0',
        private: content.private || false,
        workspaces: content.workspaces || null,
        scripts: Object.keys(content.scripts || {}),
        totalDependencies: Object.keys(projectDeps.allDependencies).length,
      }

      dependencyMap[projectName] = projectDeps
    }

    return dependencyMap
  }

  /**
   * 检测重复依赖
   * @param {object} dependencyMap - 依赖关系映射
   * @returns {Array} 重复依赖列表
   */
  detectDuplicateDependencies(dependencyMap) {
    const allDependencies = {}
    const duplicates = []

    // 收集所有依赖及其版本
    Object.values(dependencyMap).forEach((project) => {
      Object.entries(project.allDependencies).forEach(([depName, version]) => {
        if (!allDependencies[depName]) {
          allDependencies[depName] = {}
        }

        if (!allDependencies[depName][version]) {
          allDependencies[depName][version] = []
        }

        allDependencies[depName][version].push(project.name)
      })
    })

    // 找出有多个版本的依赖
    Object.entries(allDependencies).forEach(([depName, versions]) => {
      const versionKeys = Object.keys(versions)

      if (versionKeys.length > 1) {
        const duplicate = {
          name: depName,
          versions: versionKeys.map(version => ({
            version,
            usedBy: versions[version],
            count: versions[version].length,
          })),
          totalProjects: Object.values(versions).flat().length,
          severity: this.calculateDuplicateSeverity(versionKeys),
        }

        duplicates.push(duplicate)
      }
    })

    return duplicates.sort((a, b) => b.totalProjects - a.totalProjects)
  }

  /**
   * 计算重复依赖的严重程度
   * @param {Array} versions - 版本列表
   * @returns {string} 严重程度
   */
  calculateDuplicateSeverity(versions) {
    if (versions.length > 3)
      return 'high'
    if (versions.length === 3)
      return 'medium'
    return 'low'
  }

  /**
   * 分析版本冲突
   * @param {object} dependencyMap - 依赖关系映射
   * @returns {Array} 版本冲突列表
   */
  analyzeVersionConflicts(dependencyMap) {
    const conflicts = []
    const seenDependencies = {}

    Object.values(dependencyMap).forEach((project) => {
      Object.entries(project.allDependencies).forEach(([depName, version]) => {
        if (!seenDependencies[depName]) {
          seenDependencies[depName] = []
        }

        seenDependencies[depName].push({
          project: project.name,
          version,
          semverRange: this.parseSemverRange(version),
        })
      })
    })

    // 检测不兼容的版本范围
    Object.entries(seenDependencies).forEach(([depName, usages]) => {
      if (usages.length > 1) {
        const incompatibleVersions = this.findIncompatibleVersions(usages)

        if (incompatibleVersions.length > 0) {
          conflicts.push({
            dependency: depName,
            conflicts: incompatibleVersions,
            affectedProjects: usages.length,
            severity: incompatibleVersions.length > 2 ? 'high' : 'medium',
          })
        }
      }
    })

    return conflicts
  }

  /**
   * 解析Semver版本范围
   * @param {string} versionString - 版本字符串
   * @returns {object} 解析后的版本信息
   */
  parseSemverRange(versionString) {
    // 简化的Semver解析
    const cleanVersion = versionString.replace(/^[\^~>=<]/, '')
    const parts = cleanVersion.split('.')

    return {
      original: versionString,
      major: Number.parseInt(parts[0]) || 0,
      minor: Number.parseInt(parts[1]) || 0,
      patch: Number.parseInt(parts[2]) || 0,
      prerelease: cleanVersion.includes('-'),
      hasPrefix: versionString !== cleanVersion,
    }
  }

  /**
   * 查找不兼容的版本
   * @param {Array} usages - 依赖使用情况
   * @returns {Array} 不兼容的版本对
   */
  findIncompatibleVersions(usages) {
    const incompatible = []

    for (let i = 0; i < usages.length; i++) {
      for (let j = i + 1; j < usages.length; j++) {
        const usage1 = usages[i]
        const usage2 = usages[j]

        // 简化的不兼容检测：主版本号不同
        if (usage1.semverRange.major !== usage2.semverRange.major) {
          incompatible.push({
            project1: usage1.project,
            version1: usage1.version,
            project2: usage2.project,
            version2: usage2.version,
            reason: 'major-version-mismatch',
          })
        }
      }
    }

    return incompatible
  }

  /**
   * 生成分析摘要
   * @param {object} dependencyMap - 依赖关系映射
   * @param {Array} duplicates - 重复依赖列表
   * @returns {object} 摘要信息
   */
  generateSummary(dependencyMap, duplicates) {
    const projects = Object.values(dependencyMap)
    const totalProjects = projects.length

    // 统计总依赖数
    const allUniqueDeps = new Set()
    let totalDependencies = 0

    projects.forEach((project) => {
      totalDependencies += project.metadata.totalDependencies
      Object.keys(project.allDependencies).forEach(dep => allUniqueDeps.add(dep))
    })

    const uniqueDependencies = allUniqueDeps.size
    const duplicateCount = duplicates.length
    const duplicatePercentage = uniqueDependencies > 0
      ? ((duplicateCount / uniqueDependencies) * 100).toFixed(1)
      : '0'

    // 查找最常用的依赖
    const dependencyFrequency = {}
    projects.forEach((project) => {
      Object.keys(project.allDependencies).forEach((dep) => {
        dependencyFrequency[dep] = (dependencyFrequency[dep] || 0) + 1
      })
    })

    const mostUsedDependencies = Object.entries(dependencyFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count, percentage: ((count / totalProjects) * 100).toFixed(1) }))

    return {
      totalProjects,
      totalDependencies,
      uniqueDependencies,
      averageDependenciesPerProject: (totalDependencies / totalProjects).toFixed(1),
      duplicateCount,
      duplicatePercentage: `${duplicatePercentage}%`,
      mostUsedDependencies,
      healthScore: this.calculateHealthScore(uniqueDependencies, duplicateCount, totalProjects),
    }
  }

  /**
   * 计算依赖健康度分数
   * @param {number} uniqueDeps - 唯一依赖数
   * @param {number} duplicates - 重复依赖数
   * @param {number} projects - 项目数
   * @returns {object} 健康度分数
   */
  calculateHealthScore(uniqueDeps, duplicates, projects) {
    const duplicateRatio = uniqueDeps > 0 ? duplicates / uniqueDeps : 0
    const baseScore = 100

    // 重复依赖惩罚
    const duplicatePenalty = duplicateRatio * 50

    const score = Math.max(0, Math.min(100, baseScore - duplicatePenalty))

    let grade = 'A'
    if (score < 90)
      grade = 'B'
    if (score < 80)
      grade = 'C'
    if (score < 70)
      grade = 'D'
    if (score < 60)
      grade = 'F'

    return {
      score: score.toFixed(1),
      grade,
      duplicateRatio: `${(duplicateRatio * 100).toFixed(1)}%`,
    }
  }

  /**
   * 生成优化建议
   * @param {object} results - 分析结果
   * @returns {Array} 优化建议列表
   */
  generateRecommendations(results) {
    const recommendations = []
    const { summary, duplicates, versionConflicts } = results

    // 重复依赖建议
    if (duplicates.length > 0) {
      const highSeverityDuplicates = duplicates.filter(d => d.severity === 'high')

      if (highSeverityDuplicates.length > 0) {
        recommendations.push({
          type: 'duplicate-dependencies',
          priority: 'high',
          message: `发现 ${highSeverityDuplicates.length} 个高严重性重复依赖`,
          duplicates: highSeverityDuplicates.slice(0, 5),
          suggestions: [
            '使用 pnpm 的 workspace 功能统一依赖版本',
            '创建共享的依赖配置包',
            '定期审查和清理不必要的依赖',
            '使用 npm-check-updates 更新依赖版本',
          ],
        })
      }

      if (duplicates.length > 5) {
        recommendations.push({
          type: 'dependency-cleanup',
          priority: 'medium',
          message: `总共发现 ${duplicates.length} 个重复依赖，建议进行清理`,
          suggestions: [
            '建立依赖管理规范',
            '使用工具自动检测重复依赖',
            '定期进行依赖审计',
            '考虑使用 monorepo 依赖提升',
          ],
        })
      }
    }

    // 版本冲突建议
    if (versionConflicts && versionConflicts.length > 0) {
      recommendations.push({
        type: 'version-conflicts',
        priority: 'high',
        message: `发现 ${versionConflicts.length} 个版本冲突`,
        conflicts: versionConflicts.slice(0, 3),
        suggestions: [
          '统一主要依赖的版本范围',
          '使用 resolutions 字段强制版本',
          '建立版本更新策略',
          '定期同步依赖版本',
        ],
      })
    }

    // 依赖数量建议
    const avgDeps = Number.parseFloat(summary.averageDependenciesPerProject)
    if (avgDeps > 50) {
      recommendations.push({
        type: 'dependency-count',
        priority: 'medium',
        message: `平均每个项目有 ${avgDeps} 个依赖，可能过多`,
        suggestions: [
          '审查是否有不必要的依赖',
          '考虑使用更轻量级的替代方案',
          '将开发依赖移到 devDependencies',
          '使用 bundle analyzer 检查实际使用情况',
        ],
      })
    }

    return recommendations
  }
}

// CLI 运行入口
if (import.meta.url === `file://${process.argv[1]}`) {
  import('chalk').then(({ default: chalk }) => {
    import('ora').then(({ default: ora }) => {
      const analyzer = new DependencyAnalyzer()
      const spinner = ora('🔍 分析项目依赖...').start()

      analyzer.analyze('.')
        .then((results) => {
          spinner.succeed('✅ 依赖分析完成')

          console.log(chalk.blue('\n📋 依赖分析结果\n'))
          console.log(`📁 项目路径: ${results.projectPath}`)
          console.log(`📦 项目数量: ${results.summary.totalProjects}`)
          console.log(`🔗 唯一依赖: ${results.summary.uniqueDependencies}`)
          console.log(`⚠️  重复依赖: ${results.summary.duplicateCount} (${results.summary.duplicatePercentage})`)
          console.log(`💯 健康评分: ${results.summary.healthScore.score} (${results.summary.healthScore.grade})`)

          if (results.duplicates.length > 0) {
            console.log(chalk.yellow('\n🔍 重复依赖详情:'))
            results.duplicates.slice(0, 5).forEach((dup, index) => {
              console.log(`  ${index + 1}. ${dup.name} - ${dup.versions.length} 个版本`)
            })
          }

          if (results.recommendations.length > 0) {
            console.log(chalk.red('\n💡 优化建议:'))
            results.recommendations.forEach((rec, index) => {
              console.log(`  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`)
            })
          }
        })
        .catch((error) => {
          spinner.fail(`❌ 分析失败: ${error.message}`)
          process.exit(1)
        })
    })
  })
}
