# @monorepo/typescript-config

为 Monorepo 项目提供统一的 TypeScript 配置包。

## 🎯 功能特性

- **统一配置**: 标准化的 TypeScript 编译选项
- **Vue 支持**: 专为 Vue 3 项目优化的配置
- **Node.js 支持**: 构建工具和脚本的配置
- **路径映射**: 统一的别名配置
- **类型检查**: 严格的类型检查规则
- **开发体验**: 优化的 IDE 集成

## 📦 安装

```bash
# 使用 pnpm (推荐)
pnpm add -D @monorepo/typescript-config typescript

# 使用 npm
npm install -D @monorepo/typescript-config typescript
```

## 🚀 快速开始

### 基础配置

在项目根目录创建 `tsconfig.json`:

```json
{
  "extends": "@monorepo/typescript-config/tsconfig.vue.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.vue"
  ]
}
```

### Vue 项目配置

```json
{
  "extends": "@monorepo/typescript-config/tsconfig.vue.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "~/*": ["src/*"]
    }
  }
}
```

### Node.js 工具配置

创建 `tsconfig.node.json`:

```json
{
  "extends": "@monorepo/typescript-config/tsconfig.node.json",
  "include": [
    "vite.config.*",
    "tailwind.config.*",
    "scripts/**/*"
  ]
}
```

## 📋 可用配置

### tsconfig.base.json

基础 TypeScript 配置，包含:

- ES2022 目标
- 严格类型检查
- 模块解析配置
- 基本编译选项

### tsconfig.vue.json

Vue 项目配置，继承基础配置并添加:

- JSX preserve 模式
- Vue 类型支持
- 路径映射
- Vue 文件包含

### tsconfig.node.json

Node.js 配置，用于工具和脚本:

- Node.js 类型
- 配置文件支持
- 构建工具集成

### tsconfig.app.json

应用程序配置，用于生产构建:

- 捆绑器模式
- 优化的编译选项
- 严格检查

## 🛠️ JavaScript API

```js
import { createVueConfig, getProjectConfig } from '@monorepo/typescript-config'

// 创建 Vue 配置
const vueConfig = createVueConfig({
  compilerOptions: {
    paths: {
      '@/*': ['src/*']
    }
  }
})

// 获取项目特定配置
const config = getProjectConfig('gcn-website')
```

### API 方法

#### createConfig(options)

创建自定义 TypeScript 配置。

**参数:**

- `options.extends` - 继承的基础配置
- `options.compilerOptions` - 编译选项
- `options.include` - 包含文件列表
- `options.exclude` - 排除文件列表
- `options.paths` - 路径映射

#### createVueConfig(options)

创建 Vue 项目配置。

#### createNodeConfig(options)

创建 Node.js 项目配置。

#### getProjectConfig(projectName)

获取预定义的项目配置。

**支持的项目:**

- `gcn-website` - GCN 网站 (Vue + Naive UI)
- `dflm-website` - DFLM 网站
- `basketball-score` - 篮球计分应用
- `cirq` - 联系人管理应用
- `site-template` - 站点模板

## 🎨 IDE 集成

### VSCode

推荐的 `.vscode/settings.json`:

```json
{
  "typescript.preferences.useAliasesForRenames": false,
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.validate.enable": true,
  "typescript.format.enable": true
}
```

### WebStorm

启用 TypeScript 服务和智能提示。

## 📝 配置示例

### 完整的项目配置

```json
{
  "extends": "@monorepo/typescript-config/tsconfig.vue.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    },
    "types": [
      "node",
      "vite/client"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "components.d.ts",
    "auto-imports.d.ts"
  ],
  "exclude": [
    "dist",
    "node_modules"
  ]
}
```

### 复合项目配置

对于有多个子项目的情况:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

## 🔧 故障排除

### 常见问题

1. **模块解析失败**

   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler"
     }
   }
   ```

2. **Vue 文件类型错误**
   确保安装了 `@vue/tsconfig`:

   ```bash
   pnpm add -D @vue/tsconfig
   ```

3. **路径别名不工作**
   检查 `baseUrl` 和 `paths` 配置:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```

### 性能优化

- 使用 `skipLibCheck: true` 跳过库文件检查
- 启用 `incremental: true` 增量编译
- 正确配置 `exclude` 排除不必要的文件

## 🔄 版本更新

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本变更。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
