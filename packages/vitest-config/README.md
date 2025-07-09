# @monorepo/vitest-config

> 统一的 Vitest 测试配置包，为 monorepo 中的所有项目提供一致的测试环境和配置。

## 🎯 功能特性

- **🔧 统一配置**: 提供基础、Vue 和 Node.js 三种预设配置
- **📊 覆盖率报告**: 内置 V8 覆盖率提供者，支持多种报告格式
- **🎨 Vue 支持**: 完整的 Vue 3 + 组合式 API 测试支持
- **📱 JSDOM 环境**: 模拟浏览器环境进行组件测试
- **⚡ 快速执行**: 优化的并发和缓存配置
- **🔍 TypeScript 支持**: 完整的 TypeScript 类型检查
- **📈 项目特化**: 根据项目类型提供定制化配置

## 📦 安装

```bash
# 在项目中安装
pnpm add -D @monorepo/vitest-config vitest @vitest/coverage-v8 @vue/test-utils jsdom
```

## 🚀 快速开始

### Vue 项目配置

创建 `vitest.config.js`：

```javascript
import { getProjectConfig } from '@monorepo/vitest-config'
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  const config = await getProjectConfig('your-project-name')
  return config
})
```

### 基础配置

```javascript
import { createVueConfig } from '@monorepo/vitest-config'
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  return await createVueConfig({
    test: {
      // 自定义配置
      testTimeout: 5000,
    }
  })
})
```

## 📋 可用配置

### 预设配置

| 配置类型 | 用途         | 环境  | 特性           |
| -------- | ------------ | ----- | -------------- |
| `base`   | 基础配置     | JSDOM | 通用测试设置   |
| `vue`    | Vue 项目     | JSDOM | Vue 组件测试   |
| `node`   | Node.js 项目 | Node  | 脚本和工具测试 |

### 项目特定配置

支持以下项目的预配置：

- `dflm` - DFLM Website (覆盖率: 60%)
- `basketball-score` - 篮球统计应用 (覆盖率: 70%)
- `cirq` - 联系人管理 (覆盖率: 65%)
- `gcn-website` - GCN 企业网站 (覆盖率: 55%)
- `site-template` - 项目模板 (覆盖率: 40%)

## 🔧 JavaScript API

### 配置创建函数

```javascript
import {
  createConfig,
  createNodeConfig,
  createVueConfig,
  getProjectConfig
} from '@monorepo/vitest-config'

// 创建基础配置
const config = await createConfig('base', customOptions)

// 创建 Vue 配置
const vueConfig = await createVueConfig(customOptions)

// 创建 Node.js 配置
const nodeConfig = await createNodeConfig(customOptions)

// 获取项目特定配置
const projectConfig = await getProjectConfig('dflm')
```

### 配置常量

```javascript
import { CONFIG_TYPES, PROJECT_NAMES } from '@monorepo/vitest-config'

console.log(CONFIG_TYPES.VUE) // 'vue'
console.log(PROJECT_NAMES) // ['dflm', 'basketball-score', ...]
```

## 📊 测试脚本

在项目的 `package.json` 中添加：

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## 🧪 测试文件结构

### 推荐的测试文件组织

```
src/
├── components/
│   ├── AppHeader.vue
│   └── AppHeader.test.vue
├── utils/
│   ├── helpers.js
│   └── helpers.test.js
├── stores/
│   ├── user.js
│   └── user.test.js
└── test/
    └── setup.ts
```

### 测试设置文件

创建 `src/test/setup.ts`：

```typescript
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// 全局测试配置
config.global.stubs = {
  'router-link': true,
  'router-view': true
}

// Mock 浏览器 API
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })),
})
```

## 📈 覆盖率配置

### 默认覆盖率阈值

- **全局阈值**: 50% (分支、函数、行、语句)
- **项目特定阈值**: 根据项目复杂度调整
- **报告格式**: Text、JSON、HTML

### 覆盖率排除规则

自动排除以下文件：

- 测试文件本身
- 配置文件
- 类型定义文件
- Node_modules
- 构建输出目录

## 🔍 IDE 集成

### VS Code 配置

安装推荐插件：

- Vitest Extension
- Vue Language Features (Volar)

### WebStorm 配置

启用 Vitest 支持：

1. Settings → Languages & Frameworks → Node.js and NPM
2. 启用 Vitest 集成
3. 配置测试运行器

## 🚀 高级用法

### 自定义测试环境

```javascript
import { createVueConfig } from '@monorepo/vitest-config'

export default defineConfig(async () => {
  return await createVueConfig({
    test: {
      environment: 'happy-dom', // 使用 happy-dom 替代 jsdom
      setupFiles: ['./src/test/custom-setup.ts'],
      globals: true,
    }
  })
})
```

### 并行测试配置

```javascript
export default defineConfig(async () => {
  return await createVueConfig({
    test: {
      pool: 'threads',
      poolOptions: {
        threads: {
          maxThreads: 4,
          minThreads: 2,
        }
      }
    }
  })
})
```

## 🛠️ 故障排除

### 常见问题

**Q: 测试文件找不到模块**

```bash
# 确保安装了必要的依赖
pnpm add -D @vue/test-utils jsdom
```

**Q: Vue 组件测试失败**

```bash
# 检查是否正确配置了 Vue 插件
# 确保 vitest.config.js 继承了 vue 配置
```

**Q: 覆盖率报告不生成**

```bash
# 运行带覆盖率的测试
pnpm test:coverage
```

### 调试技巧

1. **启用详细输出**:

   ```bash
   vitest --reporter=verbose
   ```

2. **调试单个测试**:

   ```bash
   vitest run src/components/AppHeader.test.vue
   ```

3. **查看配置**:
   ```bash
   vitest --config
   ```

## 📚 相关资源

- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils 文档](https://test-utils.vuejs.org/)
- [JSDOM 文档](https://github.com/jsdom/jsdom)
- [V8 Coverage 文档](https://v8.dev/blog/javascript-code-coverage)

## 🤝 贡献指南

1. 遵循现有的配置模式
2. 添加适当的测试覆盖
3. 更新文档和示例
4. 确保向后兼容性

## 📄 许可证

MIT License - 详见项目根目录的 LICENSE 文件。
