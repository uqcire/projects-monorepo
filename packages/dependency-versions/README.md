# 依赖版本管理包

这个包负责管理整个 monorepo 中所有项目的依赖版本，确保版本一致性和兼容性。

## 功能

- 🎯 **统一版本管理** - 所有核心依赖的版本在一个地方定义
- 🔍 **版本查询** - 提供便捷的版本查询 API
- 📦 **分类管理** - 按照用途分类管理不同类型的依赖
- 🛡️ **类型安全** - 完整的 TypeScript 支持

## 使用方法

```javascript
import { devVersions, getVersion, versions } from '@monorepo/dependency-versions' // "^3.5.16"

// 获取所有版本
import { getAllVersions } from '@monorepo/dependency-versions'

// 获取特定依赖的版本
const vueVersion = getVersion('vue')
console.log(vueVersion)
const allVersions = getAllVersions()
```

## 版本分类

### 核心框架版本 (versions)

- Vue 生态系统 (vue, vue-router, pinia)
- 构建工具 (vite, @vitejs/plugin-vue)
- 样式框架 (tailwindcss, daisyui)
- 代码质量工具 (eslint, typescript)

### 开发依赖版本 (devVersions)

- 图标和组件 (unplugin-icons, unplugin-vue-components)
- Git 工具 (husky, lint-staged)
- 提交工具 (commitizen, cz-git)

### 项目特定版本 (projectSpecificVersions)

- 数据库 (supabase)
- UI 库 (naive-ui)
- 工具库 (nanoid)

## 版本更新流程

1. 修改此包中的版本定义
2. 在各项目中运行 `pnpm update`
3. 测试所有项目的兼容性
4. 提交更改

## 支持的项目

- basketball-score
- cirq
- dflm
- gcn-website
- site-template
