# 🛠️ Monorepo 统一工具系统

## 📋 概览

通过统一工具入口简化脚本管理，从原来的65+个脚本减少到25个核心脚本，同时提供更直观的工具分类系统。

## 🚀 快速开始

### 统一工具入口

```bash
# 查看所有可用工具
pnpm tools help

# 查看特定分类帮助
pnpm tools <category> help
```

### 常用命令

```bash
pnpm tools perf check        # 快速性能检查 (3秒)
pnpm tools build clean       # 清理构建产物
pnpm tools env set development  # 设置开发环境
pnpm tools build parallel    # 并行构建项目
```

## 📦 工具分类

### 🏗️ BUILD - 构建相关工具

```bash
pnpm tools build parallel    # 并行构建所有项目
pnpm tools build clean       # 清理构建产物
pnpm tools build deps        # 检查依赖版本一致性

# 清理选项
pnpm tools build clean --build-only  # 只清理构建产物
pnpm tools build clean --deps-only   # 只清理依赖
pnpm tools build clean --cache-only  # 只清理缓存
pnpm tools build clean --all         # 清理所有
```

### ⚡ PERF - 性能监控工具

#### 基础性能检查

```bash
pnpm tools perf check        # 快速性能检查 (3秒)
pnpm tools perf check --silent  # 静默模式快速检查
pnpm tools perf lite         # 精简性能监控 (10秒)
pnpm tools perf lite --quick # 快速模式精简监控
pnpm tools perf full         # 完整性能分析 (30秒+)
pnpm tools perf test         # 测试性能优化效果
```

#### 专业性能分析 (基于 @monorepo/performance-monitor)

```bash
# 完整分析
pnpm tools perf analyze:all     # 运行所有性能分析器
pnpm tools perf analyze:bundle  # 分析打包体积和结构
pnpm tools perf analyze:deps    # 分析依赖关系和重复依赖
pnpm tools perf analyze:build   # 分析构建时间和瓶颈
pnpm tools perf analyze:runtime # 分析运行时性能指标

# 报告生成
pnpm tools perf report:all      # 生成所有性能报告

# 基线管理
pnpm tools perf baseline:set    # 设置性能基线
pnpm tools perf baseline:check  # 检查性能基线
```

### 🌍 ENV - 环境管理工具

```bash
pnpm tools env set <env> [project]  # 设置环境
pnpm tools env get [project]        # 获取环境配置
pnpm tools env list                 # 列出所有可用环境
pnpm tools env validate [env]       # 验证环境配置
pnpm tools env reset [project]      # 重置环境配置

# 环境设置示例
pnpm tools env set development      # 设置所有项目为开发环境
pnpm tools env set production dflm  # 设置dflm项目为生产环境
```

## 🎯 快速命令别名

为了向下兼容和快速使用，保留了常用命令的直接别名：

```bash
# 核心开发命令
pnpm dev              # 启动所有应用开发服务器
pnpm build            # 并行构建所有项目
pnpm test             # 运行所有测试
pnpm lint             # 代码检查
pnpm lint:fix         # 修复代码格式

# 快速工具命令
pnpm clean            # 清理构建产物
pnpm perf             # 快速性能检查
pnpm deps:check       # 依赖版本检查

# 专业性能分析命令
pnpm perf:analyze     # 完整性能分析
pnpm perf:deps        # 依赖分析
pnpm perf:bundle      # 打包分析
pnpm perf:build       # 构建时间分析
pnpm perf:report      # 生成性能报告
pnpm perf:baseline    # 设置性能基线
```

## 📊 脚本优化对比

### 优化前 (package.json)

- **脚本数量**: 65+ 个
- **管理复杂度**: 高
- **分类混乱**: 测试脚本、环境脚本、性能脚本混合
- **重复命令**: 大量功能相似的脚本变体

### 优化后 (package.json + tools.js)

- **脚本数量**: 25 个核心脚本
- **管理复杂度**: 低
- **分类清晰**: build、perf、env 三大类别
- **统一入口**: 通过 `tools` 命令访问高级功能

## 🏗️ 脚本文件架构

```
scripts/
├── tools.js                     # 统一工具入口 (新增)
├── performance-analyzer.js      # 专业性能分析入口 (新增)
├── parallel-build.js            # 并行构建系统
├── clean-build.js               # 构建清理工具
├── check-dependencies.js        # 依赖检查工具
├── perf-check.js                # 快速性能检查
├── performance-monitor-lite.js  # 精简性能监控
├── performance-monitor.js       # 完整性能分析
├── env-manager.js               # 环境管理系统
├── test-performance-optimization.js  # 性能优化测试
└── README.md                    # 工具使用指南
```

## 🔄 迁移指南

### 从旧脚本迁移

```bash
# 旧命令 → 新命令
pnpm perf:quick          → pnpm tools perf check --silent
pnpm perf:lite           → pnpm tools perf lite
pnpm perf:analyze        → pnpm tools perf full
pnpm env:set development → pnpm tools env set development
pnpm clean:build         → pnpm tools build clean --build-only
pnpm clean:deps          → pnpm tools build clean --deps-only
```

### 常用脚本快速参考

```bash
# 日常开发
pnpm dev                 # 开发服务器
pnpm build               # 构建项目
pnpm perf                # 性能检查
pnpm clean               # 清理构建

# 高级功能 (通过 tools)
pnpm tools perf lite     # 详细性能分析
pnpm tools env set prod  # 环境配置
pnpm tools build deps    # 依赖检查
```

## 💡 最佳实践

### 开发工作流

```bash
# 1. 启动开发
pnpm dev

# 2. 定期检查性能
pnpm perf

# 3. 构建前清理
pnpm clean

# 4. 并行构建
pnpm build

# 5. 部署前检查
pnpm deploy:check
```

### 性能监控工作流

```bash
# 快速检查 (日常使用)
pnpm tools perf check

# 详细分析 (每周)
pnpm tools perf lite

# 完整报告 (发布前)
pnpm tools perf full
```

### 环境管理工作流

```bash
# 开发环境
pnpm tools env set development

# 查看当前配置
pnpm tools env get

# 生产部署
pnpm tools env set production
pnpm build:prod
```

## 🎉 优化成果

- ✅ **脚本数量减少 65%** (从65+个到25个)
- ✅ **管理复杂度降低** (统一入口 + 分类管理)
- ✅ **向下兼容** (保留常用命令别名)
- ✅ **功能增强** (更好的帮助系统和错误处理)
- ✅ **维护性提升** (清晰的文件结构和文档)

统一工具系统让 monorepo 的脚本管理更加简洁高效！🚀
