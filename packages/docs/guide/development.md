# 开发指南

本指南涵盖了在 Monorepo 项目中进行日常开发的所有重要方面，从环境设置到代码提交的完整流程。

## 开发环境设置

### 编辑器配置

#### VS Code（推荐）

安装推荐的扩展：

```json
{
  "recommendations": [
    "vue.volar", // Vue 3 支持
    "vue.typescript-vue-plugin", // Vue TypeScript 支持
    "bradlc.vscode-tailwindcss", // Tailwind CSS 智能提示
    "esbenp.prettier-vscode", // 代码格式化
    "dbaeumer.vscode-eslint", // 代码检查
    "vitest.explorer", // 测试运行器
    "ms-vscode.vscode-typescript-next" // TypeScript 支持
  ]
}
```

工作区设置已配置在 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.workingDirectories": ["packages/apps/*"],
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### 开发服务器

#### 启动所有应用

```bash
# 并行启动所有应用的开发服务器
pnpm dev
```

这会启动：

- DFLM 网站: http://localhost:5173
- 篮球计分器: http://localhost:5174
- Cirq 联系人: http://localhost:5175
- GCN 网站: http://localhost:5176
- 网站模板: http://localhost:5177

#### 启动特定应用

```bash
# 使用包名启动
pnpm --filter dflm-website dev
pnpm --filter basketball-score dev

# 使用目录路径启动
pnpm --filter ./packages/apps/dflm dev
```

#### 自定义端口

```bash
# 指定端口启动
pnpm --filter dflm-website dev -- --port 3000

# 指定主机
pnpm --filter dflm-website dev -- --host 0.0.0.0
```

## 代码开发流程

### 1. 创建新功能

#### 分支管理

```bash
# 创建功能分支
git checkout -b feature/new-feature-name

# 创建修复分支
git checkout -b fix/bug-description
```

#### 选择工作项目

```bash
# 进入特定应用目录
cd packages/apps/dflm

# 或使用 pnpm filter 在根目录操作
pnpm --filter dflm-website add vue-router
```

### 2. 添加新组件

#### Vue 组件结构

```vue
<script setup>
// 导入依赖
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// 定义 props
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

// 定义 emits
const emit = defineEmits(['update', 'close'])

// 响应式数据
const isVisible = ref(false)

// 计算属性
const displayTitle = computed(() => {
  return props.title.toUpperCase()
})

// 方法
function handleClick() {
  emit('update', { visible: !isVisible.value })
}
</script>

<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<style scoped>
.component-name {
  /* 组件样式 */
}
</style>
```

#### 组件命名规范

- **文件名**: PascalCase (`UserProfile.vue`)
- **组件名**: 与文件名一致
- **目录**: kebab-case (`user-profile/`)

### 3. 状态管理

#### Pinia Store 示例

```javascript
// stores/user.js
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref(null)
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || 'Guest')

  // 操作
  const login = async (credentials) => {
    isLoading.value = true
    try {
      // 登录逻辑
      const response = await api.login(credentials)
      user.value = response.user
    }
    catch (error) {
      console.error('Login failed:', error)
      throw error
    }
    finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
  }

  return {
    // 状态
    user,
    isLoading,
    // 计算属性
    isAuthenticated,
    userName,
    // 操作
    login,
    logout
  }
})
```

### 4. 路由配置

#### 路由结构

```javascript
// router/routes/index.js
export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: {
      title: '个人资料',
      requiresAuth: true
    }
  }
]
```

#### 路由守卫

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  }
  else {
    next()
  }
})

export default router
```

### 5. 样式开发

#### 使用共享样式

```vue
<script setup>
// 导入共享样式
import '@monorepo/styles'
</script>

<template>
  <div class="card">
    <h2 class="card-title">
      标题
    </h2>
    <p class="card-content">
      内容
    </p>
  </div>
</template>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-md p-6;
}

.card-title {
  @apply text-xl font-bold text-gray-800 mb-4;
}

.card-content {
  @apply text-gray-600 leading-relaxed;
}
</style>
```

#### Tailwind CSS 使用

```vue
<template>
  <!-- 响应式设计 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- 主题色彩 -->
    <div class="bg-primary text-primary-content p-4 rounded">
      主要内容
    </div>

    <!-- 状态样式 -->
    <button class="btn btn-primary hover:btn-primary-focus">
      按钮
    </button>

    <!-- 自定义样式 -->
    <div class="custom-component">
      自定义组件
    </div>
  </div>
</template>

<style scoped>
.custom-component {
  @apply bg-gradient-to-r from-blue-500 to-purple-600
    text-white
    p-4
    rounded-lg
    shadow-lg
    hover:shadow-xl
    transition-all
    duration-300;
}
</style>
```

## 测试开发

### 单元测试

#### 组件测试

```javascript
import { mount } from '@vue/test-utils'
// tests/components/UserProfile.test.js
import { describe, expect, it } from 'vitest'
import UserProfile from '@/components/UserProfile.vue'

describe('UserProfile', () => {
  it('renders user name correctly', () => {
    const wrapper = mount(UserProfile, {
      props: {
        user: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
    })

    expect(wrapper.text()).toContain('John Doe')
  })

  it('emits update event when edit button is clicked', async () => {
    const wrapper = mount(UserProfile, {
      props: {
        user: { name: 'John Doe', email: 'john@example.com' }
      }
    })

    await wrapper.find('[data-testid="edit-button"]').trigger('click')

    expect(wrapper.emitted('update')).toBeTruthy()
  })
})
```

#### Store 测试

```javascript
import { createPinia, setActivePinia } from 'pinia'
// tests/stores/user.test.js
import { beforeEach, describe, expect, it } from 'vitest'
import { useUserStore } from '@/stores/user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty user', () => {
    const store = useUserStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('sets user on successful login', async () => {
    const store = useUserStore()
    const mockUser = { id: 1, name: 'John Doe' }

    // Mock API response
    vi.mocked(api.login).mockResolvedValue({ user: mockUser })

    await store.login({ email: 'test@example.com', password: 'password' })

    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })
})
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定项目的测试
pnpm --filter dflm-website test

# 监听模式
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage
```

## 构建和部署

### 本地构建

```bash
# 构建所有项目
pnpm build

# 构建特定项目
pnpm --filter dflm-website build

# 并行构建（更快）
pnpm run build:parallel
```

### 预览构建结果

```bash
# 预览特定项目
pnpm --filter dflm-website preview

# 指定端口预览
pnpm --filter dflm-website preview -- --port 4000
```

### 环境管理

```bash
# 设置开发环境
pnpm run env:set development

# 设置生产环境
pnpm run env:set production

# 查看当前环境配置
pnpm run env:list
```

## 代码质量

### ESLint 检查

```bash
# 检查所有代码
pnpm lint

# 检查特定项目
pnpm --filter dflm-website lint

# 自动修复问题
pnpm lint:fix
```

### Prettier 格式化

```bash
# 格式化所有代码
pnpm format

# 检查格式
pnpm format:check
```

### TypeScript 检查

```bash
# 类型检查
pnpm type-check

# 特定项目类型检查
pnpm --filter gcn-website type-check
```

## Git 工作流

### 提交规范

使用 Conventional Commits 规范：

```bash
# 功能提交
git commit -m "feat(dflm): add user profile component"

# 修复提交
git commit -m "fix(basketball): resolve score calculation bug"

# 文档提交
git commit -m "docs: update development guide"

# 样式提交
git commit -m "style(cirq): improve contact card layout"
```

### 提交前检查

项目配置了 Husky hooks：

- **pre-commit**: 运行 ESLint 和 Prettier
- **commit-msg**: 验证提交信息格式

### 推送流程

```bash
# 1. 确保代码质量
pnpm lint
pnpm test

# 2. 提交更改
git add .
git commit -m "feat: add new feature"

# 3. 推送到远程
git push origin feature-branch

# 4. 创建 Pull Request
```

## 调试技巧

### Vue DevTools

1. 安装 Vue DevTools 浏览器扩展
2. 在开发模式下自动启用
3. 查看组件树、状态、事件

### 控制台调试

```javascript
// 在组件中添加调试点
// 使用 Vue 的调试功能
import { getCurrentInstance } from 'vue'

console.log('Component data:', { props, data })

// 使用 debugger 语句
debugger

const instance = getCurrentInstance()
console.log('Current instance:', instance)
```

### 网络请求调试

```javascript
// 在 HTTP 拦截器中添加日志
axios.interceptors.request.use((config) => {
  console.log('Request:', config)
  return config
})

axios.interceptors.response.use(
  (response) => {
    console.log('Response:', response)
    return response
  },
  (error) => {
    console.error('Request failed:', error)
    return Promise.reject(error)
  }
)
```

## 性能优化

### 代码分割

```javascript
// 路由级别的代码分割
const HomePage = () => import('@/views/HomePage.vue')

// 组件级别的代码分割
const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
)
```

### 图片优化

```vue
<template>
  <!-- 响应式图片 -->
  <picture>
    <source
      media="(min-width: 768px)"
      srcset="image-large.webp"
      type="image/webp"
    >
    <source
      media="(min-width: 768px)"
      srcset="image-large.jpg"
    >
    <img
      src="image-small.jpg"
      alt="描述"
      loading="lazy"
    >
  </picture>
</template>
```

### 构建优化

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['@headlessui/vue', 'heroicons']
        }
      }
    }
  }
})
```

## 常见问题解决

### 依赖问题

```bash
# 清理并重新安装
pnpm clean:deps
pnpm install

# 更新依赖
pnpm update

# 检查依赖冲突
pnpm why package-name
```

### 类型错误

```bash
# 重新生成类型
pnpm --filter @monorepo/typescript-config build

# 清理 TypeScript 缓存
rm -rf node_modules/.cache
```

### 热重载问题

```bash
# 重启开发服务器
pnpm dev

# 清理 Vite 缓存
rm -rf node_modules/.vite
```

## 下一步

掌握了基本开发流程后，你可以：

1. [学习构建和部署](/guide/build-deploy) - 了解部署流程
2. [阅读测试指南](/guide/testing) - 深入测试实践
3. [查看代码规范](/guide/coding-standards) - 提高代码质量
4. [探索最佳实践](/best-practices/) - 学习高级技巧
