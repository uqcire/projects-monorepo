---
layout: home

hero:
  name: Monorepo 项目
  text: 现代化前端开发工具链
  tagline: 统一管理、高效开发、企业级品质
  image:
    src: /logo.svg
    alt: Monorepo Logo
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看项目
      link: /projects/
    - theme: alt
      text: GitHub
      link: https://github.com/uqcire/projects-monorepo

features:
  - icon: 🚀
    title: 统一工具链
    details: 集成 TypeScript、Vitest、样式系统等，提供一致的开发体验
  - icon: 📦
    title: 模块化架构
    details: 共享包管理，避免重复代码，提高开发效率
  - icon: ⚡
    title: 高效构建
    details: 并行构建、智能缓存，构建速度提升 30-70%
  - icon: 🔧
    title: 开发工具
    details: ESLint、Prettier、Husky 等完整的代码质量保障
  - icon: 🎨
    title: 样式系统
    details: 统一的设计系统，支持主题切换和响应式设计
  - icon: 🧪
    title: 测试覆盖
    details: Vitest 单元测试，确保代码质量和稳定性
---

## 项目概览

这是一个现代化的前端 monorepo 项目，包含多个 Vue.js 应用和共享包。项目采用 pnpm workspace 管理，提供统一的开发工具链和构建系统。

### 🎯 核心特性

- **🏗️ Monorepo 架构**：使用 pnpm workspace 管理多个项目
- **⚡ 快速开发**：Vite + Vue 3 + TypeScript 技术栈
- **🎨 统一样式**：共享样式系统和主题配置
- **🧪 完整测试**：Vitest 测试框架和覆盖率报告
- **📋 代码规范**：ESLint + Prettier + Husky 工作流
- **🚀 自动部署**：GitHub Actions CI/CD 流水线

### 📊 项目统计

<div class="stats-grid">
  <div class="stat-card">
    <h3>5</h3>
    <p>应用项目</p>
  </div>
  <div class="stat-card">
    <h3>4</h3>
    <p>共享包</p>
  </div>
  <div class="stat-card">
    <h3>90%+</h3>
    <p>测试覆盖率</p>
  </div>
  <div class="stat-card">
    <h3>70%</h3>
    <p>构建提速</p>
  </div>
</div>

### 🛠️ 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite + Rollup
- **样式方案**：Tailwind CSS + DaisyUI
- **测试框架**：Vitest + Vue Test Utils
- **代码规范**：ESLint + Prettier
- **包管理器**：pnpm workspace
- **部署平台**：Vercel + GitHub Pages

### 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/uqcire/projects-monorepo.git

# 安装依赖
cd projects-monorepo
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建项目
pnpm build
```

### 📚 文档导航

<div class="nav-grid">
  <a href="/guide/getting-started" class="nav-card">
    <h3>🚀 快速开始</h3>
    <p>了解如何设置开发环境并开始开发</p>
  </a>

  <a href="/guide/development" class="nav-card">
    <h3>💻 开发指南</h3>
    <p>深入了解开发流程和最佳实践</p>
  </a>

  <a href="/projects/" class="nav-card">
    <h3>📦 项目介绍</h3>
    <p>查看所有应用项目和共享包的详细信息</p>
  </a>

  <a href="/api/" class="nav-card">
    <h3>📖 API 文档</h3>
    <p>查看各个包的 API 参考文档</p>
  </a>
</div>

<style>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.stat-card h3 {
  font-size: 2rem;
  font-weight: bold;
  color: var(--vp-c-brand-1);
  margin: 0 0 0.5rem 0;
}

.stat-card p {
  margin: 0;
  color: var(--vp-c-text-2);
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.nav-card {
  display: block;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-brand-1);
}

.nav-card p {
  margin: 0;
  color: var(--vp-c-text-2);
}
</style>
