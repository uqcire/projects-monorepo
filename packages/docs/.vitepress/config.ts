import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Monorepo 项目文档',
  description: '一个现代化的前端 monorepo 项目文档系统',

  // 网站配置
  lang: 'zh-CN',
  base: '/projects-monorepo/',

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '开发指南', link: '/guide/development' },
      { text: '项目', link: '/projects/' },
      { text: 'API', link: '/api/' },
      {
        text: '更多',
        items: [
          { text: '最佳实践', link: '/best-practices/' },
          { text: '故障排除', link: '/troubleshooting/' },
          { text: '更新日志', link: '/changelog' },
        ],
      },
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目结构', link: '/guide/project-structure' },
          ],
        },
        {
          text: '开发指南',
          items: [
            { text: '开发环境设置', link: '/guide/development' },
            { text: '构建和部署', link: '/guide/build-deploy' },
            { text: '测试', link: '/guide/testing' },
            { text: '代码规范', link: '/guide/coding-standards' },
          ],
        },
        {
          text: '工具链',
          items: [
            { text: 'TypeScript 配置', link: '/guide/typescript' },
            { text: '样式系统', link: '/guide/styles' },
            { text: 'Vitest 测试', link: '/guide/vitest' },
            { text: '构建脚本', link: '/guide/build-scripts' },
          ],
        },
      ],
      '/projects/': [
        {
          text: '项目概览',
          items: [
            { text: '所有项目', link: '/projects/' },
            { text: '项目架构', link: '/projects/architecture' },
          ],
        },
        {
          text: '应用项目',
          items: [
            { text: 'DFLM 网站', link: '/projects/dflm' },
            { text: '篮球计分器', link: '/projects/basketball-score' },
            { text: 'Cirq 联系人管理', link: '/projects/cirq' },
            { text: 'GCN 网站', link: '/projects/gcn-website' },
            { text: '网站模板', link: '/projects/site-template' },
          ],
        },
        {
          text: '共享包',
          items: [
            { text: '样式系统', link: '/projects/styles' },
            { text: 'TypeScript 配置', link: '/projects/typescript-config' },
            { text: 'Vitest 配置', link: '/projects/vitest-config' },
            { text: '依赖管理', link: '/projects/dependency-versions' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '概览', link: '/api/' },
            { text: '样式系统 API', link: '/api/styles' },
            { text: '配置 API', link: '/api/configs' },
            { text: '工具函数', link: '/api/utils' },
          ],
        },
      ],
      '/best-practices/': [
        {
          text: '最佳实践',
          items: [
            { text: '概览', link: '/best-practices/' },
            { text: '代码组织', link: '/best-practices/code-organization' },
            { text: '性能优化', link: '/best-practices/performance' },
            { text: '安全规范', link: '/best-practices/security' },
            { text: 'Git 工作流', link: '/best-practices/git-workflow' },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/uqcire/projects-monorepo' },
    ],

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/uqcire/projects-monorepo/edit/main/packages/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    // 页脚
    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright © 2024 Monorepo Project',
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },

    // 上次更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
  },

  // Markdown 配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息',
    },
  },

  // 构建配置
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@monorepo/styles/themes.css";`,
        },
      },
    },
  },

  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],
})
