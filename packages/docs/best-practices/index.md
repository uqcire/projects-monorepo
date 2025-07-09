# 最佳实践

本节提供在 Monorepo 项目中开发的最佳实践和经验总结，帮助团队提高开发效率和代码质量。

## 代码组织

### 目录结构规范

```
src/
├── components/          # 组件按功能分组
│   ├── common/         # 通用组件
│   ├── layout/         # 布局组件
│   └── feature/        # 功能特定组件
├── composables/        # 组合式函数
├── stores/             # 状态管理
├── utils/              # 工具函数
├── types/              # 类型定义
└── assets/             # 静态资源
```

### 文件命名

- **组件**: PascalCase (`UserProfile.vue`)
- **文件**: camelCase (`userUtils.js`)
- **目录**: kebab-case (`user-management/`)
- **常量**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 代码质量

### 组件设计原则

1. **单一职责**: 每个组件只负责一个功能
2. **可复用性**: 通过 props 和 slots 提高复用性
3. **可测试性**: 编写易于测试的组件

```vue
<!-- ✅ 好的示例 -->
<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="user-card">
    <slot name="avatar">
      <img :src="user.avatar" :alt="user.name">
    </slot>
    <div class="user-info">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
    <slot name="actions" :user="user" />
  </div>
</template>
```

### 状态管理

```javascript
// ✅ 好的 Store 设计
export const useUserStore = defineStore('user', () => {
  // 状态
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const activeUsers = computed(() =>
    users.value.filter(user => user.active)
  )

  // 操作
  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.getUsers()
      users.value = response.data
    }
    catch (err) {
      error.value = err.message
    }
    finally {
      loading.value = false
    }
  }

  return {
    // 状态
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    // 计算属性
    activeUsers,
    // 操作
    fetchUsers
  }
})
```

## 性能优化

### 组件优化

```vue
<script setup>
// 异步组件
const AsyncHeavyComponent = defineAsyncComponent(
  () => import('./HeavyComponent.vue')
)
</script>

<template>
  <div>
    <!-- 使用 v-memo 优化列表渲染 -->
    <div
      v-for="item in items"
      :key="item.id"
      v-memo="[item.id, item.updatedAt]"
    >
      {{ item.name }}
    </div>

    <!-- 懒加载重型组件 -->
    <Suspense>
      <template #default>
        <AsyncHeavyComponent />
      </template>
      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </div>
</template>
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
    <img
      :src="imageSrc"
      :alt="imageAlt"
      loading="lazy"
      @load="onImageLoad"
    >
  </picture>
</template>
```

## 安全规范

### 输入验证

```javascript
// 表单验证
function validateForm(data) {
  const errors = {}

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = '请输入有效的邮箱地址'
  }

  if (!data.password || data.password.length < 8) {
    errors.password = '密码至少需要8个字符'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// 输入清理
function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>]/g, '') // 基础 XSS 防护
    .slice(0, 1000) // 限制长度
}
```

### API 安全

```javascript
// HTTP 拦截器中的安全处理
axios.interceptors.request.use((config) => {
  // 添加认证头
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // 添加 CSRF 令牌
  const csrfToken = getCsrfToken()
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }

  return config
})
```

## Git 工作流

### 分支策略

```bash
# 主分支
main                 # 生产环境代码
develop             # 开发环境代码

# 功能分支
feature/user-auth   # 新功能开发
feature/payment     # 支付功能

# 修复分支
fix/login-bug       # 问题修复
hotfix/security     # 紧急修复
```

### 提交规范

```bash
# 提交类型
feat:     新功能
fix:      问题修复
docs:     文档更新
style:    代码格式化
refactor: 代码重构
test:     测试相关
chore:    构建工具等

# 提交示例
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(ui): resolve button alignment issue"
git commit -m "docs: update API documentation"
```

## 测试策略

### 测试金字塔

```
    /\
   /  \     E2E Tests (少量)
  /____\
 /      \   Integration Tests (适量)
/__________\ Unit Tests (大量)
```

### 单元测试

```javascript
// 组件测试
describe('UserCard', () => {
  it('displays user information correctly', () => {
    const user = { name: 'John', email: 'john@example.com' }
    const wrapper = mount(UserCard, { props: { user } })

    expect(wrapper.text()).toContain('John')
    expect(wrapper.text()).toContain('john@example.com')
  })

  it('emits event when action button is clicked', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser }
    })

    await wrapper.find('[data-testid="action-btn"]').trigger('click')

    expect(wrapper.emitted('action')).toBeTruthy()
  })
})
```

### 集成测试

```javascript
// API 集成测试
describe('User API', () => {
  it('creates user successfully', async () => {
    const userData = { name: 'John', email: 'john@test.com' }

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201)

    expect(response.body.data.name).toBe('John')
  })
})
```

## 部署策略

### 环境管理

```javascript
// 环境配置
const config = {
  development: {
    API_URL: 'http://localhost:3000',
    DEBUG: true
  },
  staging: {
    API_URL: 'https://api-staging.example.com',
    DEBUG: false
  },
  production: {
    API_URL: 'https://api.example.com',
    DEBUG: false
  }
}
```

### CI/CD 流程

```yaml
# GitHub Actions 示例
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: pnpm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build application
        run: pnpm build

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploying..."
```

## 监控和日志

### 错误监控

```javascript
// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)

  // 发送到监控服务
  errorReporting.captureException(event.error)
})

// Vue 错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err)
  errorReporting.captureException(err, {
    context: info,
    component: instance?.$options.name
  })
}
```

### 性能监控

```javascript
// 性能指标收集
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'navigation') {
      analytics.track('page_load_time', {
        duration: entry.loadEventEnd - entry.loadEventStart
      })
    }
  })
})

observer.observe({ entryTypes: ['navigation'] })
```

## 文档规范

### 代码注释

```javascript
/**
 * 用户认证服务
 * @class AuthService
 */
class AuthService {
  /**
   * 用户登录
   * @param {object} credentials - 登录凭据
   * @param {string} credentials.email - 邮箱地址
   * @param {string} credentials.password - 密码
   * @returns {Promise<User>} 用户信息
   * @throws {AuthError} 认证失败时抛出
   */
  async login(credentials) {
    // 实现逻辑
  }
}
```

### README 模板

```markdown
# 项目名称

简短的项目描述

## 功能特性

- 功能1
- 功能2

## 快速开始

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## 项目结构

\`\`\`
src/
├── components/
├── stores/
└── utils/
\`\`\`

## 贡献指南

请阅读 [贡献指南](CONTRIBUTING.md)

## 许可证

MIT License
```

## 团队协作

### 代码审查

1. **审查清单**:
   - 代码逻辑正确性
   - 性能影响
   - 安全考虑
   - 测试覆盖

2. **反馈原则**:
   - 建设性意见
   - 具体的改进建议
   - 及时响应

### 知识分享

- 定期技术分享
- 文档更新
- 最佳实践总结
- 工具使用培训

通过遵循这些最佳实践，团队可以构建更高质量、更可维护的代码库。
