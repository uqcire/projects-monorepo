# 🚀 Web Projects Monorepo

> 一个现代化的 Vue.js 应用程序 Monorepo，包含多个独立的前端项目和统一的开发环境配置。

[![CI/CD](https://github.com/uqcire/projects-monorepo/workflows/CI/badge.svg)](https://github.com/uqcire/projects-monorepo/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.11.0-brightgreen)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-10.12.4-blue)](https://pnpm.io/)
[![Dev Environment](https://img.shields.io/badge/dev--environment-tested-green)](./dev-environment-report.md)

## 📋 项目概览

这个 Monorepo 包含 5 个独立的 Vue.js 应用程序，采用统一的开发规范、工具链和依赖管理策略。每个项目都有其独特的业务场景和功能特性。

### 🎯 包含的项目

| 项目                    | 描述                                     | 技术栈                        | 状态        |
| ----------------------- | ---------------------------------------- | ----------------------------- | ----------- |
| 🏀 **Basketball Score** | 篮球统计应用，支持球员数据管理和比赛统计 | Vue 3 + Supabase + DaisyUI    | ✅ 活跃开发 |
| 👥 **Cirq**             | 个人关系管理系统，智能联系人管理和提醒   | Vue 3 + Supabase + DaisyUI    | ✅ 活跃开发 |
| 🧄 **DFLM Website**     | 好蒜道澳洲官网，企业品牌展示站点         | Vue 3 + Tailwind CSS          | ✅ 活跃开发 |
| 🚢 **GCN Website**      | 全球货运网络企业官网                     | Vue 3 + Naive UI + TypeScript | ✅ 活跃开发 |
| 📝 **Site Template**    | Vue 项目开发模板，快速项目启动脚手架     | Vue 3 + DaisyUI + Vite        | ✅ 维护中   |

### 🛠️ 共享基础设施

| 组件                       | 描述                 | 版本       |
| -------------------------- | -------------------- | ---------- |
| 📦 **Dependency Versions** | 统一的依赖版本管理   | 1.0.0      |
| ⚙️ **Vite Config**         | 共享的 Vite 构建配置 | 1.0.0      |
| 🎨 **Tailwind Config**     | 共享的样式配置和主题 | 1.0.0      |
| 🧪 **Dev Environment**     | 开发环境测试套件     | 1.0.0      |
| 🎨 **ESLint Config**       | 统一的代码规范配置   | 继承根配置 |

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 20.11.0 ([使用 .nvmrc 文件](/.nvmrc))
- **pnpm**: 10.12.4
- **Git**: 最新版本

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/uqcire/projects-monorepo.git
cd projects-monorepo

# 2. 安装依赖
pnpm install

# 3. 检查依赖版本一致性
pnpm run deps:check

# 4. 启动所有项目的开发服务器
pnpm run dev
```

### 开发环境测试

在开始开发之前，建议运行开发环境测试来确保所有配置正确：

```bash
# 运行完整的开发环境测试套件
pnpm run dev:test

# 测试 Tailwind CSS 配置和主题
pnpm run tailwind:test
```

**测试覆盖范围：**

- ✅ 配置文件完整性检查 (100%)
- ✅ 依赖版本一致性验证 (100%)
- ✅ 构建功能测试 (80%)
- ✅ 开发服务器启动 (100%)
- ✅ 热重载功能 (100%)
- ✅ 共享配置使用 (100%)

### 单独启动项目

```bash
# 🚀 使用简化命令启动项目
pnpm run dev:dflm                # DFLM Website
pnpm run dev:basketball          # Basketball Score
pnpm run dev:cirq                # Cirq
pnpm run dev:gcn                 # GCN Website
pnpm run dev:template            # Site Template

# 📦 或使用完整的 filter 命令
pnpm --filter "dflm-website" dev
pnpm --filter "project--basketball-stats-app" dev
pnpm --filter "Cirq" dev
pnpm --filter "gcn-website" dev
pnpm --filter "project-development-environment--daysi-ui" dev
```

## 📁 项目结构

```
.
├── 🏀 basketball-score/          # 篮球统计应用
│   ├── src/
│   │   ├── components/          # 组件目录
│   │   ├── stores/             # Pinia 状态管理
│   │   ├── views/              # 页面组件
│   │   └── utils/              # 工具函数
│   └── package.json
├── 👥 cirq/                     # 联系人管理系统
│   ├── src/
│   │   ├── components/         # 联系人相关组件
│   │   ├── store/              # 数据存储
│   │   └── views/              # 页面视图
│   └── package.json
├── 🧄 dflm/                     # DFLM 企业官网
│   ├── src/
│   │   ├── assets/             # 品牌资源文件
│   │   ├── components/         # 公共组件
│   │   └── views/              # 页面组件
│   └── package.json
├── 🚢 gcn-website/              # GCN 企业官网
│   ├── src/
│   │   ├── components/         # Naive UI 组件
│   │   ├── pages/              # 页面目录
│   │   └── layout/             # 布局组件
│   └── package.json
├── 📝 site-template/            # 项目模板
│   └── src/                    # 标准 Vue 项目结构
├── 📦 packages/                 # 共享包
│   ├── dependency-versions/    # 依赖版本管理
│   ├── tailwind-config/       # Tailwind 配置包
│   └── vite-config/           # Vite 配置包
├── 🛠️ scripts/                  # 工具脚本
│   ├── check-dependencies.js  # 依赖检查脚本
│   └── test-dev-environment.ps1 # 开发环境测试脚本
├── .github/                    # GitHub Actions
├── .nvmrc                      # Node.js 版本
├── dev-environment-report.md   # 开发环境测试报告
├── dev-test-results.json      # 测试结果数据
├── pnpm-workspace.yaml        # Workspace 配置
├── eslint.config.js          # ESLint 配置
└── package.json              # 根配置文件
```

## 🔧 开发工具和脚本

### 常用命令

```bash
# 🔍 依赖管理
pnpm run deps:check              # 检查依赖版本一致性
pnpm run deps:update             # 更新所有依赖到最新版本

# 🏗️ 构建和开发
pnpm run dev                     # 并行启动所有项目开发服务器
pnpm run build                   # 构建所有项目
pnpm run preview                 # 预览构建结果

# 🧪 开发环境测试
pnpm run dev:test                # 运行开发环境完整测试套件
pnpm run tailwind:test           # 测试 Tailwind 配置和主题

# 🚀 单项目开发服务器
pnpm run dev:dflm                # 启动 DFLM Website
pnpm run dev:basketball          # 启动 Basketball Score
pnpm run dev:cirq                # 启动 Cirq
pnpm run dev:gcn                 # 启动 GCN Website
pnpm run dev:template            # 启动 Site Template

# 🧹 代码质量
pnpm run lint                    # 检查所有项目的代码规范
pnpm run lint:fix                # 自动修复代码规范问题

# 🔍 类型检查
pnpm run type-check              # TypeScript 类型检查
```

### 项目特定命令

```bash
# 为特定项目执行命令
pnpm --filter "项目名" <命令>

# 例如：
pnpm --filter "basketball-score" build
pnpm --filter "cirq" test
pnpm --filter "dflm-website" lint
```

## 🎯 项目详细介绍

### 🏀 Basketball Score - 篮球统计应用

**功能特性:**

- 📊 球员统计数据管理
- 🎮 实时比赛数据记录
- 📈 数据可视化和分析
- 🔄 Supabase 实时数据同步

**技术栈:** Vue 3 + Pinia + Supabase + DaisyUI + Tailwind CSS

**开发状态:** ✅ 活跃开发中，支持完整的球员和比赛管理功能

---

### 👥 Cirq - 个人关系管理系统

**功能特性:**

- 🤝 智能联系人管理
- ⏰ 关系维护提醒
- 📝 互动历史记录
- 🏷️ 灵活的标签系统
- 🔐 隐私优先的本地存储

**技术栈:** Vue 3 + Pinia + Supabase + DaisyUI

**开发状态:** ✅ MVP 完成，正在开发智能提醒系统

**愿景:** 帮助用户有意识地维护人际关系，不仅是联系人管理器，更是关系记忆助手。

---

### 🧄 DFLM Website - 好蒜道澳洲官网

**功能特性:**

- 🎨 现代化品牌展示
- 🌿 产品系列介绍
- 🌏 澳洲本地化设计
- 📱 完全响应式布局

**技术栈:** Vue 3 + Tailwind CSS + Vue Router

**开发状态:** ✅ 核心页面完成，持续优化用户体验

**品牌特色:** 专注于无添加、真鲜香的中式蒜蓉调味解决方案

---

### 🚢 GCN Website - 全球货运网络官网

**功能特性:**

- 🌐 企业服务展示
- 📍 全球办公室信息
- 📋 联系表单系统
- 💼 专业的 B2B 设计

**技术栈:** Vue 3 + TypeScript + Naive UI + Sass

**开发状态:** ✅ 核心功能完成，提供完整的企业展示解决方案

---

### 📝 Site Template - Vue 项目模板

**功能特性:**

- 🚀 快速项目启动
- ⚙️ 预配置开发环境
- 🎨 DaisyUI 组件库
- 📦 最佳实践结构

**技术栈:** Vue 3 + Vite + DaisyUI + Pinia

**开发状态:** ✅ 稳定维护，提供标准化的项目脚手架

## 🔄 开发工作流

### Git 分支策略

```
main (生产分支)
├── develop (开发分支)
├── feature/项目名-功能描述 (功能分支)
├── fix/项目名-修复描述 (修复分支)
└── release/v版本号 (发布分支)
```

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能提交
git commit -m "feat(basketball-score): add player statistics dashboard"

# 修复提交
git commit -m "fix(cirq): resolve contact form validation issue"

# 重构提交
git commit -m "refactor(shared): unify Tailwind configuration"

# 文档提交
git commit -m "docs: update README with new project structure"
```

### 代码审查清单

- [ ] 代码符合 ESLint 规范
- [ ] TypeScript 类型检查通过
- [ ] 所有测试用例通过
- [ ] 响应式设计正常工作
- [ ] 性能优化已考虑
- [ ] 文档已更新

## 🚀 部署说明

### 自动化部署

项目配置了 GitHub Actions，支持：

- ✅ 代码质量检查 (ESLint + TypeScript)
- ✅ 依赖安全审查
- ✅ 自动构建和测试
- ✅ 部署状态通知

### 手动部署

```bash
# 构建所有项目
pnpm run build

# 构建特定项目
pnpm --filter "项目名" build

# 预览构建结果
pnpm --filter "项目名" preview
```

## 🤝 贡献指南

### 开发流程

1. **Fork 本仓库**
2. **创建功能分支**: `git checkout -b feature/项目名-新功能`
3. **提交更改**: `git commit -m 'feat(项目名): 添加新功能'`
4. **推送分支**: `git push origin feature/项目名-新功能`
5. **创建 Pull Request**

### 贡献规范

- 遵循现有的代码风格和架构模式
- 添加必要的测试用例
- 更新相关文档
- 确保所有 CI 检查通过

### 问题反馈

- 🐛 **Bug 报告**: 使用 [Bug Report 模板](.github/ISSUE_TEMPLATE/bug_report.md)
- 💡 **功能请求**: 使用 [Feature Request 模板](.github/ISSUE_TEMPLATE/feature_request.md)
- ❓ **问题咨询**: 使用 [Question 模板](.github/ISSUE_TEMPLATE/question.md)

## 📊 项目统计

- **总代码行数**: ~50,000+ 行
- **包含组件**: 50+ 个 Vue 组件
- **支持的功能**: 用户管理、数据统计、内容展示、表单处理
- **测试覆盖率**: 目标 >80%
- **构建时间**: < 2 分钟 (所有项目)
- **包大小**: 平均 < 500KB (gzipped)

## 🛡️ 技术规范

### 核心技术栈

| 技术         | 版本    | 用途     |
| ------------ | ------- | -------- |
| Vue.js       | ^3.5.17 | 前端框架 |
| Vite         | ^6.3.5  | 构建工具 |
| TypeScript   | ^5.8.3  | 类型系统 |
| Tailwind CSS | ^4.1.11 | 样式框架 |
| Pinia        | ^3.0.3  | 状态管理 |
| Vue Router   | ^4.5.1  | 路由管理 |

### 代码质量工具

- **ESLint**: 代码规范检查
- **Prettier**: 代码格式化
- **Husky**: Git hooks 管理
- **lint-staged**: 提交时代码检查
- **Commitizen**: 规范化提交信息

### 性能优化

- 🚀 **代码分割**: 路由级别的懒加载
- 📦 **Tree Shaking**: 移除未使用的代码
- 🗜️ **资源压缩**: Gzip/Brotli 压缩
- 🖼️ **图片优化**: WebP 格式 + 懒加载
- ⚡ **缓存策略**: 智能缓存配置
- 🔥 **开发体验**: 热重载 + 快速构建
- 🌐 **端口管理**: 自动端口分配避免冲突

## 📜 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 👥 维护团队

- **项目负责人**: [@uqcire](https://github.com/uqcire)
- **技术架构**: [@uqcire](https://github.com/uqcire)
- **全栈开发**: [@uqcire](https://github.com/uqcire)

## 📞 联系方式

- **GitHub Issues**: [项目问题反馈](https://github.com/uqcire/projects-monorepo/issues)
- **讨论区**: [GitHub Discussions](https://github.com/uqcire/projects-monorepo/discussions)
- **开发环境报告**: [查看测试详情](./dev-environment-report.md)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个 Star！**

Made with ❤️ by [@uqcire](https://github.com/uqcire)

</div>
