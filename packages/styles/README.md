# @monorepo/styles

统一的样式系统包，为所有monorepo项目提供一致的设计语言和样式基础。

## 📋 功能特性

- **🎨 统一主题系统** - 7个预设主题，支持深色/浅色模式
- **🔄 CSS Reset** - 基于现代最佳实践的样式重置
- **🧩 组件样式库** - 通用组件的标准化样式
- **🛠️ 实用工具类** - 完整的实用CSS类库
- **📝 字体管理** - 统一的字体配置和加载
- **📱 响应式设计** - 移动优先的设计理念
- **♿ 无障碍支持** - 内置的可访问性优化

## 🎨 可用主题

| 主题名称        | 描述           | 主色调         | 适用项目         |
| --------------- | -------------- | -------------- | ---------------- |
| `light`         | 默认浅色主题   | 蓝色 (#3b82f6) | 通用             |
| `dark`          | 深色主题       | 蓝色 (#60a5fa) | 通用             |
| `basketball`    | 篮球运动主题   | 橙色 (#ea580c) | Basketball Score |
| `cirq`          | 联系人管理主题 | 紫色 (#8b5cf6) | Cirq             |
| `dflm`          | 品牌绿色主题   | 绿色 (#059669) | DFLM Website     |
| `gcn`           | 企业蓝色主题   | 深蓝 (#1e40af) | GCN Website      |
| `high-contrast` | 高对比度主题   | 黑白           | 可访问性         |

## 🚀 快速开始

### 1. 安装依赖

```bash
# 在项目的 package.json 中添加依赖
{
  "dependencies": {
    "@monorepo/styles": "workspace:*"
  }
}
```

### 2. 导入样式

在你的全局样式文件中：

```css
/* 导入完整样式系统 */
@import '@monorepo/styles/base';
@import '@monorepo/styles/themes';
@import '@monorepo/styles/fonts';
@import '@monorepo/styles/components';
@import '@monorepo/styles/utilities';
```

或按需导入：

```css
/* 仅导入基础样式和主题 */
@import '@monorepo/styles/reset';
@import '@monorepo/styles/themes';
```

### 3. 配置主题

```css
/* DaisyUI 配置 */
@plugin "daisyui" {
  themes: [ 'basketball'];
  theme: 'basketball' --default;
}
```

### 4. JavaScript 主题控制

```js
import { initTheme, setTheme } from '@monorepo/styles'

// 设置主题
setTheme('dark')

// 自动初始化项目主题
initTheme('basketball-score')

// 监听系统主题变化
watchSystemTheme()
```

## 📁 文件结构

```
packages/styles/
├── index.js          # 主入口文件和JS API
├── package.json      # 包配置
├── reset.css         # CSS Reset
├── base.css          # 基础样式 + Tailwind 导入
├── themes.css        # 主题色彩定义
├── fonts.css         # 字体配置和加载
├── components.css    # 通用组件样式
├── utilities.css     # 实用工具类
└── README.md         # 文档
```

## 🎯 使用示例

### 基础组件使用

```html
<!-- 使用统一的按钮样式 -->
<button class="btn-base btn-primary">主要按钮</button>
<button class="btn-base btn-secondary">次要按钮</button>

<!-- 使用卡片组件 -->
<div class="card">
  <div class="card-header">
    <h3>标题</h3>
  </div>
  <div class="card-body">
    <p>内容</p>
  </div>
</div>

<!-- 使用表单组件 -->
<div class="form-group">
  <label class="form-label">邮箱</label>
  <input type="email" class="form-input" placeholder="请输入邮箱" />
</div>
```

### 自定义项目样式

```css
/* 项目特定样式覆盖 */
:root[data-project='your-project'] {
  /* 覆盖全局变量 */
  --color-primary: #your-color;
  --font-heading: 'Your-Font', var(--font-sans);
}

/* 项目特定组件 */
.your-component {
  background-color: var(--color-primary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}
```

### 主题切换器

```vue
<script>
import { getCurrentTheme, setTheme, themes } from '@monorepo/styles'

export default {
  data() {
    return {
      themes,
      currentTheme: getCurrentTheme()
    }
  },
  methods: {
    setTheme(theme) {
      setTheme(theme)
      this.currentTheme = theme
    }
  }
}
</script>

<template>
  <div class="theme-selector">
    <div
      v-for="theme in themes"
      :key="theme"
      class="theme-option" :class="[{ active: currentTheme === theme }]"
      @click="setTheme(theme)"
    >
      <div class="theme-preview" :style="getThemePreview(theme)" />
      <span>{{ theme }}</span>
    </div>
  </div>
</template>
```

## 🎨 设计系统

### 色彩系统

```css
/* 语义化色彩 */
--color-primary      /* 主要色彩 */
--color-secondary    /* 次要色彩 */
--color-accent       /* 强调色彩 */
--color-success      /* 成功状态 */
--color-warning      /* 警告状态 */
--color-error        /* 错误状态 */
--color-info         /* 信息状态 */

/* 中性色彩 */
--color-base-100     /* 背景色 */
--color-base-200     /* 浅背景 */
--color-base-300     /* 深背景 */
--color-base-content /* 文本色 */
```

### 间距系统

```css
/* 标准间距尺度 */
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */
--spacing-2xl: 3rem; /* 48px */
--spacing-3xl: 4rem; /* 64px */
```

### 字体系统

```css
/* 字体栈 */
--font-sans:    /* 无衬线字体 */ --font-serif: /* 衬线字体 */ --font-mono: /* 等宽字体 */ --font-display: /* 显示字体 */
  /* 字体大小 */ --font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
/* ... 更多尺寸 */
```

### 阴影系统

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

## 🔧 API 参考

### JavaScript API

```js
// 样式模块加载
import { loadStyles, styleModules } from '@monorepo/styles'

// 主题管理
import {
  detectSystemTheme, // 检测系统主题
  getCurrentTheme, // 获取当前主题
  setTheme, // 设置主题
  themes // 所有可用主题列表
} from '@monorepo/styles'

// 项目特定主题
import {
  initTheme, // 初始化主题
  projectThemes, // 项目主题映射
  setProjectTheme // 设置项目主题
} from '@monorepo/styles'

// 加载指定模块
await loadStyles(['reset', 'base', 'themes'])
```

### CSS 导入

```css
/* 模块化导入 */
@import '@monorepo/styles'; /* 完整导入 */
@import '@monorepo/styles/reset'; /* CSS Reset */
@import '@monorepo/styles/base'; /* 基础样式 */
@import '@monorepo/styles/themes'; /* 主题配置 */
@import '@monorepo/styles/fonts'; /* 字体配置 */
@import '@monorepo/styles/components'; /* 组件样式 */
@import '@monorepo/styles/utilities'; /* 工具类 */
```

## 🎯 项目集成

### 1. Basketball Score 项目

```css
/* 篮球主题配置 */
@import '@monorepo/styles/base';
@import '@monorepo/styles/themes';

@plugin "daisyui" {
  themes: [ 'basketball'];
  theme: 'basketball' --default;
}

/* 项目特定样式 */
.stat-card {
  border-left: 4px solid var(--color-primary);
  transition: all var(--transition-base);
}
```

### 2. Cirq 项目

```css
/* 联系人管理主题 */
@plugin "daisyui" {
  themes: [ 'cirq'];
  theme: 'cirq' --default;
}

/* 联系人卡片样式 */
.contact-card {
  border-left: 3px solid var(--contact-primary);
  transition: all var(--transition-base);
}
```

### 3. DFLM Website

```css
/* 品牌主题配置 */
@plugin "daisyui/theme" {
  name: 'dflm';
  --color-primary: #ffd400;
  --color-secondary: #ed6c2b;
}

/* 品牌字体配置 */
:root[data-project='dflm'] {
  --font-display: 'pilar-pro', var(--font-sans);
  --font-brand: 'pilar-pro', var(--font-sans);
}
```

## 🔍 测试和验证

### 运行样式系统测试

```bash
# 测试样式系统集成
pnpm styles:test

# 测试单个项目构建
pnpm --filter "./packages/apps/project-name" build
```

### 测试覆盖内容

- ✅ 共享样式包是否正确安装
- ✅ 各项目依赖配置是否正确
- ✅ 样式文件导入是否成功
- ✅ 项目构建是否正常
- ✅ 主题配置是否生效

## 🛠️ 开发和维护

### 添加新主题

1. 在 `themes.css` 中定义新主题：

```css
[data-theme='new-theme'] {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  /* ... 其他颜色定义 */
}
```

2. 在 `index.js` 中添加主题：

```js
export const themes = [
  'light',
  'dark',
  'new-theme' // 添加新主题
]
```

3. 更新项目主题映射（如需要）：

```js
export const projectThemes = {
  'your-project': 'new-theme'
}
```

### 添加新组件样式

在 `components.css` 中添加：

```css
.your-component {
  /* 使用设计系统变量 */
  background-color: var(--color-base-100);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: all var(--transition-base);
}
```

## 📚 参考资源

- [Tailwind CSS 文档](https://tailwindcss.com/)
- [DaisyUI 组件库](https://daisyui.com/)
- [Josh's CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/)
- [Modern Normalize](https://github.com/sindresorhus/modern-normalize)

## 🤝 贡献指南

1. 遵循现有的设计系统变量
2. 确保新添加的样式有适当的文档
3. 运行测试确保不会破坏现有功能
4. 考虑不同主题下的样式表现

## 📄 许可证

MIT License - 详见项目根目录的 LICENSE 文件。
