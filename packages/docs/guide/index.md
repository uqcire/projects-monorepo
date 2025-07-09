# 介绍

欢迎使用 Monorepo 项目！这是一个现代化的前端开发解决方案，旨在提供统一、高效的开发体验。

## 什么是 Monorepo？

Monorepo（单一仓库）是一种软件开发策略，将多个相关项目存储在同一个版本控制仓库中。这种方法有许多优势：

### 🎯 核心优势

- **统一依赖管理**：所有项目共享相同的依赖版本，避免版本冲突
- **代码复用**：通过共享包减少重复代码，提高开发效率
- **原子化提交**：跨项目的更改可以在单个提交中完成
- **统一工具链**：所有项目使用相同的构建、测试、代码检查工具
- **简化 CI/CD**：统一的持续集成和部署流程

## 项目架构

我们的 monorepo 采用以下架构：

```
projects/
├── packages/
│   ├── apps/                    # 应用项目
│   │   ├── dflm/               # DFLM 官网
│   │   ├── basketball-score/   # 篮球计分器
│   │   ├── cirq/               # 联系人管理系统
│   │   ├── gcn-website/        # GCN 企业网站
│   │   └── site-template/      # 网站模板
│   ├── styles/                 # 共享样式系统
│   ├── typescript-config/      # TypeScript 配置
│   ├── vitest-config/          # 测试配置
│   ├── dependency-versions/    # 依赖版本管理
│   └── docs/                   # 文档系统
├── scripts/                    # 构建和工具脚本
└── pnpm-workspace.yaml        # 工作区配置
```

## 技术栈

### 前端技术

- **Vue 3**：现代化的渐进式 JavaScript 框架
- **TypeScript**：类型安全的 JavaScript 超集
- **Vite**：快速的构建工具和开发服务器
- **Vue Router**：官方路由管理器
- **Pinia**：轻量级状态管理库

### 样式方案

- **Tailwind CSS**：实用优先的 CSS 框架
- **DaisyUI**：基于 Tailwind 的组件库
- **SCSS**：CSS 预处理器

### 开发工具

- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Husky**：Git hooks 管理
- **Commitlint**：提交信息规范

### 测试框架

- **Vitest**：快速的单元测试框架
- **Vue Test Utils**：Vue 组件测试工具
- **Coverage**：测试覆盖率报告

### 包管理

- **pnpm**：快速、节省磁盘空间的包管理器
- **workspace**：monorepo 工作区管理

## 设计原则

### 1. 一致性优先

所有项目遵循相同的代码规范、目录结构和开发流程，确保团队成员可以快速在不同项目间切换。

### 2. 模块化设计

通过共享包实现功能模块化，每个包都有明确的职责和边界，便于维护和扩展。

### 3. 开发体验

优化开发工具链，提供快速的热重载、智能的代码提示和完善的错误处理。

### 4. 质量保证

集成完整的测试框架和代码质量检查工具，确保代码的可靠性和可维护性。

### 5. 性能优化

采用现代化的构建工具和优化策略，确保应用的加载速度和运行性能。

## 开始之前

在开始使用本项目之前，请确保你了解以下技术：

- **Node.js** 和 **npm/pnpm** 基础知识
- **Vue 3** 组合式 API
- **TypeScript** 基本语法
- **Git** 版本控制
- **命令行** 基本操作

## 下一步

- [快速开始](/guide/getting-started) - 设置开发环境
- [项目结构](/guide/project-structure) - 了解项目组织
- [开发指南](/guide/development) - 深入开发流程

## 获取帮助

如果你在使用过程中遇到问题：

1. 查看 [故障排除](/troubleshooting/) 页面
2. 搜索 [GitHub Issues](https://github.com/uqcire/projects-monorepo/issues)
3. 提交新的 Issue 或 Pull Request

我们欢迎所有形式的贡献和反馈！
