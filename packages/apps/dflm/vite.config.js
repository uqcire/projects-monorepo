
import { createVueViteConfig } from '@monorepo/vite-config'

// https://vitejs.dev/config/
export default createVueViteConfig({
  projectRoot: import.meta.dirname,
  enableIcons: true, // 启用图标插件
  enableCompression: true,
  enableVisualizer: true,
})
