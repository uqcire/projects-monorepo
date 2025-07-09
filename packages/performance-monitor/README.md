# @monorepo/performance-monitor

> 🚀 **企业级 Monorepo 性能监控和分析工具包**

专为大型 monorepo 项目设计的性能监控系统，提供全方位的构建性能分析、依赖关系检测和自动化报告功能。

## ✨ 核心功能

### 📊 **多维度性能分析**

- **Bundle 分析** - 打包体积、Tree-shaking 效果、代码分割优化
- **依赖分析** - 重复依赖检测、版本冲突识别、依赖关系可视化
- **构建时间分析** - 构建耗时监控、瓶颈识别、优化建议
- **运行时分析** - 内存使用、加载性能、运行效率监控

### 📈 **智能报告系统**

- **可视化仪表盘** - 实时性能数据展示
- **历史趋势对比** - 性能变化追踪和预警
- **自动化报告** - 定期生成详细性能报告
- **基准管理** - 性能基准设置和回归检测

### 🔧 **开发者工具**

- **CLI 工具** - 命令行性能分析
- **CI/CD 集成** - 自动化性能检查
- **实时监控** - 开发过程中的性能反馈
- **优化建议** - 智能化性能优化推荐

## 🚀 快速开始

### 基础分析

```bash
# 运行所有分析
pnpm --filter @monorepo/performance-monitor analyze:all

# 分别运行各类分析
pnpm --filter @monorepo/performance-monitor analyze:bundle   # 打包分析
pnpm --filter @monorepo/performance-monitor analyze:deps    # 依赖分析
pnpm --filter @monorepo/performance-monitor analyze:build   # 构建分析
```

### 报告生成

```bash
# 生成所有报告
pnpm --filter @monorepo/performance-monitor report:all

# 分别生成各类报告
pnpm --filter @monorepo/performance-monitor report:bundle      # 打包报告
pnpm --filter @monorepo/performance-monitor report:performance # 性能报告
pnpm --filter @monorepo/performance-monitor report:comparison  # 对比报告
```

### 基准管理

```bash
# 设置性能基准
pnpm --filter @monorepo/performance-monitor baseline:set

# 检查性能回归
pnpm --filter @monorepo/performance-monitor baseline:check
```

### 实时监控

```bash
# 启动性能监控
pnpm --filter @monorepo/performance-monitor monitor:start

# 启动可视化仪表盘
pnpm --filter @monorepo/performance-monitor dashboard:serve
```

## 📁 项目结构

```
packages/performance-monitor/
├── src/
│   ├── analyzers/           # 核心分析器
│   │   ├── bundle-analyzer.js      # 打包体积分析
│   │   ├── dependency-analyzer.js  # 依赖关系分析
│   │   ├── build-time-analyzer.js  # 构建时间分析
│   │   └── runtime-analyzer.js     # 运行时性能分析
│   ├── reports/             # 报告生成系统
│   │   ├── bundle-report.js        # 打包报告
│   │   ├── performance-report.js   # 性能报告
│   │   └── comparison-report.js    # 历史对比报告
│   ├── utils/               # 工具函数
│   │   ├── metrics-collector.js    # 指标收集器
│   │   ├── data-formatter.js       # 数据格式化
│   │   └── baseline-manager.js     # 基准管理
│   ├── dashboard/           # 可视化仪表盘
│   ├── monitor.js           # 实时监控主程序
│   └── index.js            # 入口文件
├── package.json
└── README.md
```

## 🎯 性能指标

### 构建性能目标

- **总构建时间** < 5分钟 (并行构建)
- **增量构建时间** < 30秒
- **冷启动时间** < 2分钟

### 打包体积目标

- **主包体积** < 500KB (gzipped)
- **第三方依赖** < 1MB (gzipped)
- **代码分割效率** > 80%

### 依赖健康度目标

- **重复依赖** < 5%
- **过时依赖** < 10%
- **安全漏洞** = 0

## 🔍 使用示例

### 1. 分析特定项目的打包体积

```javascript
import { BundleAnalyzer } from '@monorepo/performance-monitor'

const analyzer = new BundleAnalyzer()
const result = await analyzer.analyze('packages/apps/dflm')

console.log(`总体积: ${result.totalSize}`)
console.log(`Gzip 后: ${result.gzippedSize}`)
console.log(`最大文件: ${result.largestFiles}`)
```

### 2. 检测依赖重复

```javascript
import { DependencyAnalyzer } from '@monorepo/performance-monitor'

const analyzer = new DependencyAnalyzer()
const duplicates = await analyzer.findDuplicates()

console.log('发现重复依赖:', duplicates)
```

### 3. 监控构建时间

```javascript
import { BuildTimeAnalyzer } from '@monorepo/performance-monitor'

const analyzer = new BuildTimeAnalyzer()
const metrics = await analyzer.measureBuildTime('build:parallel')

console.log(`构建时间: ${metrics.totalTime}ms`)
console.log(`最慢的项目: ${metrics.slowestProject}`)
```

## 🚧 开发计划

- [x] 基础架构搭建
- [x] 核心分析器实现
- [x] 报告生成系统
- [ ] 可视化仪表盘
- [ ] CI/CD 集成
- [ ] 性能优化建议引擎
- [ ] 实时监控系统

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

## �� 许可证

MIT License
