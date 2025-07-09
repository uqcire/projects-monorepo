# 快速开始

本指南将帮助你快速设置开发环境并开始使用 Monorepo 项目。

## 环境要求

在开始之前，请确保你的开发环境满足以下要求：

### 必需软件

- **Node.js** >= 20.11.0
- **pnpm** >= 10.12.4
- **Git** >= 2.30.0

### 推荐工具

- **VS Code** 或其他现代代码编辑器
- **Vue DevTools** 浏览器扩展
- **Git GUI** 工具（如 SourceTree、GitKraken）

## 安装步骤

### 1. 克隆项目

```bash
# 使用 HTTPS
git clone https://github.com/uqcire/projects-monorepo.git

# 或使用 SSH
git clone git@github.com:uqcire/projects-monorepo.git

# 进入项目目录
cd projects-monorepo
```

### 2. 安装 pnpm

如果你还没有安装 pnpm，可以通过以下方式安装：

```bash
# 使用 npm 安装
npm install -g pnpm@10.12.4

# 或使用 corepack（推荐）
corepack enable
corepack prepare pnpm@10.12.4 --activate
```

### 3. 安装依赖

```bash
# 安装所有项目的依赖
pnpm install
```

这个命令会：

- 安装根目录的依赖
- 安装所有应用和包的依赖
- 创建符号链接连接内部包
- 设置 Git hooks

### 4. 验证安装

```bash
# 检查项目状态
pnpm run check-dependencies

# 运行测试确保一切正常
pnpm test
```

## 开发工作流

### 启动开发服务器

```bash
# 启动所有应用的开发服务器
pnpm dev

# 或启动特定应用
pnpm --filter dflm-website dev
pnpm --filter basketball-score dev
pnpm --filter cirq dev
```

各应用的访问地址：

- **DFLM 网站**: http://localhost:5173
- **篮球计分器**: http://localhost:5174
- **Cirq 联系人**: http://localhost:5175
- **GCN 网站**: http://localhost:5176
- **网站模板**: http://localhost:5177

### 构建项目

```bash
# 构建所有项目
pnpm build

# 构建特定项目
pnpm --filter dflm-website build
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 监听模式运行测试
pnpm test:watch
```

### 代码检查和格式化

```bash
# 检查代码质量
pnpm lint

# 自动修复代码问题
pnpm lint:fix

# 格式化代码
pnpm format
```

## VS Code 配置

为了获得最佳的开发体验，建议安装以下 VS Code 扩展：

### 推荐扩展

```json
{
  "recommendations": [
    "vue.volar",
    "vue.typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "vitest.explorer"
  ]
}
```

### 工作区设置

项目已包含 `.vscode/settings.json` 配置文件，包含：

- 自动格式化设置
- ESLint 集成
- TypeScript 配置
- 文件关联设置

## 项目脚本

### 根目录脚本

| 脚本         | 描述                     |
| ------------ | ------------------------ |
| `pnpm dev`   | 启动所有应用的开发服务器 |
| `pnpm build` | 构建所有项目             |
| `pnpm test`  | 运行所有测试             |
| `pnpm lint`  | 检查代码质量             |
| `pnpm clean` | 清理构建产物和依赖       |

### 应用脚本

每个应用都有标准的脚本：

| 脚本      | 描述           |
| --------- | -------------- |
| `dev`     | 启动开发服务器 |
| `build`   | 构建生产版本   |
| `preview` | 预览构建结果   |
| `test`    | 运行测试       |
| `lint`    | 代码检查       |

## 常见问题

### 依赖安装失败

如果遇到依赖安装问题：

```bash
# 清理缓存
pnpm store prune

# 删除 node_modules 和锁文件
pnpm clean:deps

# 重新安装
pnpm install
```

### 端口冲突

如果默认端口被占用，Vite 会自动选择下一个可用端口。你也可以手动指定端口：

```bash
pnpm --filter dflm-website dev -- --port 3000
```

### TypeScript 错误

如果遇到 TypeScript 类型错误：

```bash
# 重新生成类型定义
pnpm --filter @monorepo/typescript-config build

# 重启 TypeScript 服务
# 在 VS Code 中：Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

## 下一步

现在你已经成功设置了开发环境，可以：

1. [了解项目结构](/guide/project-structure) - 熟悉代码组织
2. [阅读开发指南](/guide/development) - 学习开发流程
3. [查看项目介绍](/projects/) - 了解各个应用
4. [探索 API 文档](/api/) - 查看共享包的 API

## 获取帮助

如果你在设置过程中遇到问题：

- 查看 [故障排除指南](/troubleshooting/)
- 搜索 [GitHub Issues](https://github.com/uqcire/projects-monorepo/issues)
- 提交新的 Issue 描述你的问题

欢迎加入我们的开发社区！
