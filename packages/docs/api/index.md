# API 文档

本节提供所有共享包的 API 参考文档，帮助开发者了解如何使用各个包的功能和接口。

## 概览

我们的 Monorepo 包含以下共享包，每个包都提供特定的功能和 API：

### 📦 可用包

| 包名                            | 版本  | 描述            | 文档                     |
| ------------------------------- | ----- | --------------- | ------------------------ |
| `@monorepo/styles`              | 1.0.0 | 统一样式系统    | [查看 API](/api/styles)  |
| `@monorepo/typescript-config`   | 1.0.0 | TypeScript 配置 | [查看 API](/api/configs) |
| `@monorepo/vitest-config`       | 1.0.0 | 测试配置        | [查看 API](/api/configs) |
| `@monorepo/dependency-versions` | 1.0.0 | 依赖版本管理    | [查看 API](/api/utils)   |

## 安装和使用

### 在项目中使用共享包

```bash
# 在应用中添加依赖（已预配置）
pnpm --filter your-app add @monorepo/styles
```

### 导入和使用

```javascript
// 导入依赖版本
import { getVersion } from '@monorepo/dependency-versions'

// 导入 TypeScript 配置
import { config } from '@monorepo/typescript-config'

// 导入样式系统
import '@monorepo/styles'
```

## 样式系统 API

### 基础导入

```javascript
// 导入所有样式
import '@monorepo/styles'

// 按需导入
import '@monorepo/styles/reset.css'
import '@monorepo/styles/themes.css'
import '@monorepo/styles/components.css'
```

### CSS 变量

```css
/* 主题色彩 */
:root {
  --primary: #3b82f6;
  --secondary: #64748b;
  --accent: #f59e0b;
  --neutral: #374151;
  --base-100: #ffffff;
  --base-200: #f8fafc;
  --base-300: #e2e8f0;
}

/* 使用示例 */
.my-component {
  background-color: var(--primary);
  color: var(--base-100);
}
```

### 工具类

```html
<!-- 布局 -->
<div class="container mx-auto px-4">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- 内容 -->
  </div>
</div>

<!-- 组件样式 -->
<div class="card">
  <h2 class="card-title">标题</h2>
  <p class="card-content">内容</p>
</div>

<!-- 按钮样式 -->
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
```

## TypeScript 配置 API

### 基础配置

```json
// tsconfig.json
{
  "extends": "@monorepo/typescript-config/vue.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 可用配置

| 配置文件      | 用途         | 特性                     |
| ------------- | ------------ | ------------------------ |
| `base.json`   | 基础配置     | 基本 TypeScript 设置     |
| `vue.json`    | Vue 项目     | Vue SFC 支持，组合式 API |
| `node.json`   | Node.js 项目 | 服务端配置               |
| `strict.json` | 严格模式     | 更严格的类型检查         |

### 类型定义

```typescript
// 导入全局类型
/// <reference types="@monorepo/typescript-config" />

// 使用预定义类型
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
```

## 测试配置 API

### Vitest 配置

```javascript
import { createVitestConfig } from '@monorepo/vitest-config'
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig(
  createVitestConfig({
    // 项目特定配置
    test: {
      globals: true,
      environment: 'jsdom'
    }
  })
)
```

### 测试工具

```javascript
// 导入测试工具
import {
  createTestStore,
  mockApiCall,
  renderComponent
} from '@monorepo/vitest-config/utils'

// 组件测试
const wrapper = renderComponent(MyComponent, {
  props: { title: 'Test' }
})

// API Mock
mockApiCall('/api/users', { data: [] })

// Store 测试
const store = createTestStore()
```

## 依赖版本管理 API

### 版本获取

```javascript
import {
  devVersions,
  getAllVersions,
  getVersion,
  versions
} from '@monorepo/dependency-versions'

// 获取特定依赖版本
const vueVersion = getVersion('vue')
console.log(vueVersion) // ^3.5.17

// 获取所有版本
const allVersions = getAllVersions()

// 直接访问版本对象
console.log(versions.vue) // ^3.5.17
console.log(devVersions.vitest) // ^2.1.8
```

### 版本常量

```javascript
import {
  nodeVersion,
  packageManager
} from '@monorepo/dependency-versions'

console.log(packageManager) // pnpm@10.12.4
console.log(nodeVersion) // 20.11.0
```

## 工具函数

### 通用工具

```javascript
// 日期工具
import { formatDate, parseDate } from '@/utils/date'

// HTTP 工具
import { createHttpClient } from '@/utils/http'

// 验证工具
import { isEmail, isPhone, isURL } from '@/utils/validation' // true

const api = createHttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000
})

console.log(isEmail('test@example.com')) // true
console.log(isPhone('+1234567890')) // true
console.log(isURL('https://example.com'))

const formatted = formatDate(new Date(), 'YYYY-MM-DD')
const parsed = parseDate('2024-01-01')
```

### 存储工具

```javascript
// 本地存储
import { storage } from '@/utils/storage'

// 设置数据
storage.set('user', { name: 'John', id: 1 })

// 获取数据
const user = storage.get('user')

// 删除数据
storage.remove('user')

// 清空存储
storage.clear()
```

## 类型定义

### 通用类型

```typescript
// API 响应类型
interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
  code: number
}

// 分页类型
interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 用户类型
interface User {
  id: number
  name: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// 表单类型
interface FormState<T = Record<string, any>> {
  values: T
  errors: Partial<Record<keyof T, string>>
  loading: boolean
  touched: Partial<Record<keyof T, boolean>>
}
```

### Vue 组件类型

```typescript
// 组件 Props 类型
interface ButtonProps {
  type?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  icon?: string
}

// 组件 Emits 类型
interface ButtonEmits {
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}

// 组合式函数类型
interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetch: () => Promise<void>
  refresh: () => Promise<void>
}
```

## 错误处理

### API 错误

```javascript
// HTTP 拦截器中的错误处理
axios.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
      router.push('/login')
    }
    else if (error.response?.status >= 500) {
      // 处理服务器错误
      showNotification('服务器错误，请稍后重试')
    }
    return Promise.reject(error)
  }
)
```

### 组件错误边界

```vue
<script setup>
function handleError(error, instance, info) {
  console.error('Component error:', error)
  // 发送错误报告
  reportError(error, { component: instance, info })
}
</script>

<template>
  <div>
    <ErrorBoundary @error="handleError">
      <MyComponent />
    </ErrorBoundary>
  </div>
</template>
```

## 性能优化

### 代码分割

```javascript
// 路由级别分割
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  }
]

// 组件级别分割
const HeavyComponent = defineAsyncComponent({
  loader: () => import('@/components/HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

### 缓存策略

```javascript
// HTTP 缓存
const apiCache = new Map()

async function cachedFetch(url, options = {}) {
  const cacheKey = `${url}:${JSON.stringify(options)}`

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey)
  }

  const response = await fetch(url, options)
  const data = await response.json()

  apiCache.set(cacheKey, data)

  // 5分钟后清除缓存
  setTimeout(() => {
    apiCache.delete(cacheKey)
  }, 5 * 60 * 1000)

  return data
}
```

## 下一步

- [查看样式系统 API](/api/styles) - 详细的样式 API 文档
- [查看配置 API](/api/configs) - TypeScript 和测试配置
- [查看工具函数 API](/api/utils) - 通用工具函数
- [返回项目概览](/projects/) - 查看所有项目
