# 项目结构

本文档详细介绍了 Monorepo 项目的目录结构和组织方式，帮助你快速了解代码的组织逻辑。

## 总体结构

```
projects/
├── .github/                     # GitHub 配置
│   └── workflows/              # CI/CD 工作流
├── .vscode/                    # VS Code 配置
├── packages/                   # 主要代码目录
│   ├── apps/                   # 应用项目
│   └── [共享包]/               # 共享包
├── scripts/                    # 构建和工具脚本
├── package.json               # 根目录包配置
├── pnpm-workspace.yaml        # 工作区配置
└── README.md                  # 项目说明
```

## 应用项目 (packages/apps/)

### DFLM 网站 (dflm/)

企业官网项目，展示大蒜产品和公司信息。

```
dflm/
├── src/
│   ├── assets/                # 静态资源
│   ├── components/            # Vue 组件
│   │   └── common/           # 通用组件
│   ├── layouts/              # 布局组件
│   ├── router/               # 路由配置
│   ├── store/                # 状态管理
│   ├── styles/               # 样式文件
│   ├── utils/                # 工具函数
│   └── views/                # 页面组件
├── public/                   # 公共资源
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
└── tailwind.config.js       # Tailwind 配置
```

### 篮球计分器 (basketball-score/)

实时篮球比赛计分应用，支持球员统计和数据分析。

```
basketball-score/
├── src/
│   ├── components/
│   │   └── stats/           # 统计组件
│   ├── stores/              # Pinia 状态管理
│   │   ├── auth.js         # 认证状态
│   │   ├── game.js         # 比赛状态
│   │   ├── player.js       # 球员状态
│   │   └── team.js         # 团队状态
│   ├── utils/
│   │   ├── gameUtils.js    # 比赛工具
│   │   └── timerUtils.js   # 计时工具
│   └── lib/
│       └── supabase.js     # Supabase 客户端
└── [标准应用结构]
```

### Cirq 联系人管理 (cirq/)

联系人管理系统，支持增删改查和数据同步。

```
cirq/
├── src/
│   ├── components/
│   │   └── contacts/        # 联系人组件
│   ├── store/
│   │   ├── contacts.js     # 联系人状态
│   │   └── supabase.js     # 数据库连接
│   └── utils/
│       ├── date.js         # 日期工具
│       ├── storage.js      # 存储工具
│       └── validation.js   # 验证工具
└── [标准应用结构]
```

### GCN 网站 (gcn-website/)

企业网站项目，使用 TypeScript 和 Naive UI。

```
gcn-website/
├── src/
│   ├── components/
│   │   ├── BlogCard/       # 博客卡片
│   │   └── ContactFormCard/ # 联系表单
│   ├── layout/
│   │   └── components/     # 布局组件
│   ├── pages/              # 页面组件
│   └── styles/
│       ├── main.scss       # 主样式
│       └── _*.scss         # 样式模块
├── tsconfig.json           # TypeScript 配置
└── [标准应用结构]
```

### 网站模板 (site-template/)

通用网站模板，可作为新项目的起点。

```
site-template/
├── src/
│   ├── components/         # 基础组件
│   ├── lib/               # 库文件
│   └── [最小应用结构]
└── [标准应用结构]
```

## 共享包

### 样式系统 (@monorepo/styles)

统一的样式系统，包含 CSS Reset、主题和组件样式。

```
styles/
├── base.css               # 基础样式
├── reset.css              # CSS Reset
├── themes.css             # 主题变量
├── components.css         # 组件样式
├── utilities.css          # 工具类
├── fonts.css              # 字体定义
├── index.js               # 入口文件
└── package.json           # 包配置
```

### TypeScript 配置 (@monorepo/typescript-config)

统一的 TypeScript 配置，支持不同项目类型。

```
typescript-config/
├── base.json              # 基础配置
├── vue.json               # Vue 项目配置
├── node.json              # Node.js 配置
├── package.json           # 包配置
└── README.md              # 使用说明
```

### Vitest 配置 (@monorepo/vitest-config)

统一的测试配置，支持单元测试和覆盖率报告。

```
vitest-config/
├── base.config.js         # 基础测试配置
├── vue.config.js          # Vue 组件测试
├── coverage.config.js     # 覆盖率配置
├── package.json           # 包配置
└── README.md              # 使用说明
```

### 依赖版本管理 (@monorepo/dependency-versions)

统一管理所有依赖的版本，确保一致性。

```
dependency-versions/
├── index.js               # 版本定义
├── package.json           # 包配置
└── README.md              # 使用说明
```

### 文档系统 (@monorepo/docs)

VitePress 文档系统，提供完整的项目文档。

```
docs/
├── .vitepress/
│   └── config.ts          # VitePress 配置
├── guide/                 # 指南文档
├── projects/              # 项目文档
├── api/                   # API 文档
├── best-practices/        # 最佳实践
├── public/                # 静态资源
└── index.md               # 首页
```

## 根目录文件

### package.json

根目录的包配置文件，定义了：

- 工作区脚本
- 开发依赖
- 构建脚本
- 代码质量工具

### pnpm-workspace.yaml

pnpm 工作区配置，定义了包的位置：

```yaml
packages:
  - 'packages/*'
  - 'packages/apps/*'
```

### 脚本目录 (scripts/)

包含构建和工具脚本：

```
scripts/
├── parallel-build.js      # 并行构建脚本
├── env-manager.js         # 环境管理脚本
├── clean-build.js         # 清理脚本
├── test-build-scripts.js  # 构建测试脚本
└── check-dependencies.js  # 依赖检查脚本
```

## 配置文件

### ESLint 配置

- 根目录：`eslint.config.js`
- 各应用：继承根配置并添加特定规则

### Git 配置

- `.gitignore`：忽略文件配置
- `.gitattributes`：Git 属性配置

### VS Code 配置

- `.vscode/settings.json`：编辑器设置
- `.vscode/extensions.json`：推荐扩展

## 文件命名规范

### Vue 组件

- **PascalCase**：`UserProfile.vue`
- **组件目录**：`components/user/UserProfile.vue`

### JavaScript/TypeScript 文件

- **camelCase**：`userUtils.js`
- **常量文件**：`constants.js`
- **类型文件**：`types.ts`

### 样式文件

- **kebab-case**：`user-profile.css`
- **模块样式**：`UserProfile.module.css`

### 目录结构

- **kebab-case**：`user-management/`
- **单数形式**：`component/` 而不是 `components/`（除非确实包含多个）

## 导入路径规范

### 相对导入

```javascript
// 上级目录
import { Component } from '../components/Component.vue'

// 同级文件
import { helper } from './utils'
```

### 绝对导入

```javascript
import { config } from '@monorepo/typescript-config'

// 从 src 根目录
import { api } from '@/utils/api'
// 共享包
import '@monorepo/styles'
```

## 最佳实践

### 1. 代码组织

- 按功能模块组织，而不是按文件类型
- 保持目录结构的一致性
- 使用 `index.js` 文件简化导入

### 2. 命名约定

- 使用描述性的名称
- 保持命名风格的一致性
- 避免缩写和模糊的名称

### 3. 文件大小

- 单个文件不超过 500 行
- 复杂组件拆分为多个子组件
- 使用 composition 函数提取逻辑

### 4. 依赖管理

- 优先使用共享包
- 避免重复安装相同依赖
- 定期更新依赖版本

## 下一步

了解了项目结构后，你可以：

1. [学习开发指南](/guide/development) - 了解开发流程
2. [查看具体项目](/projects/) - 深入了解各个应用
3. [探索 API 文档](/api/) - 学习共享包的使用
4. [阅读最佳实践](/best-practices/) - 提高代码质量
