# @shared/tailwind-config

统一的 Tailwind CSS 配置包，为 monorepo 中的所有项目提供一致的样式配置和主题管理。

## 🚀 特性

- 📦 **统一配置**: 所有项目使用一致的基础配置
- 🎨 **主题预设**: 为每个项目提供专门的主题配置
- 🔧 **可扩展**: 支持项目特定的配置扩展
- 💄 **DaisyUI 集成**: 内置 DaisyUI 支持和自定义主题
- 🎯 **类型安全**: 提供完整的 TypeScript 支持

## 📦 安装

这个包是 monorepo 内部包，通过 workspace 安装：

```bash
pnpm add @shared/tailwind-config --workspace
```

## 🔧 使用方法

### 基础使用

```javascript
// tailwind.config.js
const { createTailwindConfig } = require('@shared/tailwind-config')

module.exports = createTailwindConfig({
  daisyui: true, // 启用 DaisyUI
})
```

### 使用项目预设

```javascript
// dflm/tailwind.config.js
const { createTailwindConfig } = require('@shared/tailwind-config')
const { dflmPreset } = require('@shared/tailwind-config/presets')

module.exports = createTailwindConfig({
  daisyui: true,
  extend: dflmPreset,
})
```

### 自定义配置

```javascript
// gcn-website/tailwind.config.js
const { createTailwindConfig } = require('@shared/tailwind-config')
const { gcnPreset } = require('@shared/tailwind-config/presets')

module.exports = createTailwindConfig({
  daisyui: false,
  preflight: false, // 禁用 preflight
  extend: gcnPreset,
})
```

### 完全自定义

```javascript
const { createTailwindConfig } = require('@shared/tailwind-config')

module.exports = createTailwindConfig({
  daisyui: true,
  content: ['./custom/**/*.vue'], // 额外的内容路径
  theme: {
    extend: {
      colors: {
        brand: '#custom-color',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
})
```

## 🎨 可用预设

### 项目预设

| 预设                 | 项目             | 特性                         |
| -------------------- | ---------------- | ---------------------------- |
| `dflmPreset`         | DFLM Website     | 自定义字体 (pilar-pro)       |
| `gcnPreset`          | GCN Website      | 企业配色、多字体、自定义间距 |
| `basketballPreset`   | Basketball Score | DaisyUI + 篮球主题           |
| `cirqPreset`         | Cirq             | DaisyUI + 个人关系主题       |
| `siteTemplatePreset` | Site Template    | DaisyUI 基础配置             |

### 主题预设

```javascript
const { basketballTheme, cirqTheme, dflmTheme, gcnTheme } = require('@shared/tailwind-config/themes')

// 在 DaisyUI 配置中使用
daisyui: {
  themes: [
    "light",
    "dark",
    basketballTheme.basketball,
    cirqTheme.cirq,
    dflmTheme["dflm-brand"],
    gcnTheme["gcn-corporate"],
  ],
}
```

## ⚙️ 配置选项

### `createTailwindConfig(options)`

| 选项        | 类型      | 默认值  | 描述               |
| ----------- | --------- | ------- | ------------------ |
| `daisyui`   | `boolean` | `false` | 是否启用 DaisyUI   |
| `extend`    | `Object`  | `{}`    | 自定义扩展配置     |
| `content`   | `Array`   | `[]`    | 额外的内容扫描路径 |
| `theme`     | `Object`  | `{}`    | 主题扩展配置       |
| `plugins`   | `Array`   | `[]`    | 额外的插件         |
| `preflight` | `boolean` | `true`  | 是否启用 preflight |

## 🎨 内置颜色系统

### 基础颜色

```css
/* 通用状态颜色 */
.text-success  /* #10b981 - 绿色 */
.text-warning  /* #f59e0b - 黄色 */
.text-error    /* #ef4444 - 红色 */
.text-info     /* #3b82f6 - 蓝色 */
```

### GCN 企业色彩

```css
/* 品牌色彩 */
.text-fgl-primary     /* #092147 - Downriver */
.text-fgl-lime        /* #c2d730 - Lime */
.text-fgl-coconut     /* #f2f7d5 - Coconut Cream */
.text-fgl-valencia    /* #db3e4d - Valencia */
.text-gcn-keppel      /* #36A692 - Keppel */

/* 状态色彩 */
.text-fgl-success     /* #207f4c - Eucalyptus */
.text-fgl-info        /* #d1d2d1 - Pumice */
.text-fgl-warning     /* #ffd111 - Candlelight */
.text-fgl-error       /* #cc2200 - Milano */
```

## 🔤 字体配置

### DFLM 项目字体

```css
.font-pilar  /* pilar-pro 字体族 */
```

### GCN 项目字体

```css
.font-fira     /* Fira Code */
.font-work     /* Work Sans */
.font-lato     /* Lato */
.font-raleway  /* Raleway */
.font-krona    /* Krona One */
.font-tcsans   /* Noto Sans TC */
.font-tcserif  /* Noto Serif TC */
```

## 📱 响应式配置

### GCN 自定义断点

```css
/* 自定义屏幕尺寸 */
sm:   375px - 767px   /* 手机 */
md:   768px - 1023px  /* 平板 */
lg:   1024px - 1339px /* 小桌面 */
xl:   1440px - 1919px /* 大桌面 */
2xl:  1920px+         /* 超大屏 */
```

### GCN 自定义间距

```css
/* 自定义间距系统 */
space-0:  0rem      space-7:  3.5rem
space-1:  0.5rem    space-8:  4rem
space-2:  1rem      space-9:  4.5rem
space-3:  1.5rem    space-10: 5rem
space-4:  2rem      space-11: 5.5rem
space-5:  2.5rem    space-12: 6rem
space-6:  3rem      space-13: 12rem
                    space-14: 24rem
```

## 🛠️ 开发

### 本地开发

```bash
# 安装依赖
pnpm install

# 运行测试（如果有）
pnpm test
```

### 添加新预设

1. 在 `presets/index.js` 中添加新的预设配置
2. 在 `themes/index.js` 中添加对应的主题（如果需要）
3. 更新文档

### 版本发布

```bash
# 更新版本
npm version patch|minor|major

# 更新依赖包中的版本引用
pnpm run deps:update
```

## 📚 示例项目配置

### Basketball Score

```javascript
// basketball-score/tailwind.config.js
const { createTailwindConfig } = require('@shared/tailwind-config')
const { basketballTheme } = require('@shared/tailwind-config/themes')

module.exports = createTailwindConfig({
  daisyui: true,
  extend: {
    daisyui: {
      themes: [
        'light',
        'dark',
        basketballTheme.basketball,
      ],
    },
  },
})
```

### DFLM Website

```javascript
// dflm/tailwind.config.js
const { createTailwindConfig } = require('@shared/tailwind-config')
const { dflmPreset } = require('@shared/tailwind-config/presets')
const { dflmTheme } = require('@shared/tailwind-config/themes')

module.exports = createTailwindConfig({
  daisyui: true,
  extend: {
    ...dflmPreset,
    daisyui: {
      themes: [
        'light',
        'dark',
        dflmTheme['dflm-brand'],
      ],
    },
  },
})
```

### GCN Website

```javascript
// gcn-website/tailwind.config.js
const { createTailwindConfig } = require('@shared/tailwind-config')
const { gcnPreset } = require('@shared/tailwind-config/presets')

module.exports = createTailwindConfig({
  daisyui: false,
  preflight: false,
  extend: gcnPreset,
})
```

## 🤝 贡献

1. 所有修改需要考虑对现有项目的影响
2. 新增颜色需要遵循命名规范
3. 主题修改需要更新相关文档
4. 提交前请运行依赖检查

## �� 许可证

MIT License
