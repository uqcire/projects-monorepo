import { createVueViteConfig } from '@monorepo/vite-config'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default createVueViteConfig({
  projectRoot: import.meta.dirname,
  enableAutoImport: true, // 启用自动导入
  enableCompression: true,
  enableVisualizer: true,
  customPlugins: [
    VueSetupExtend(), // gcn-website 特有的插件
  ],
  customConfig: {
    publicDir: './public/',
    build: {
      assetsDir: 'public', // gcn-website 特有的资源目录配置
    },
    server: {
      host: '0.0.0.0', // gcn-website 特有的服务器配置
      port: 3000,
      open: true,
    },
  },
})
