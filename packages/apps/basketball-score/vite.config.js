
import { createVueViteConfig } from '@monorepo/vite-config'

// https://vitejs.dev/config/
export default createVueViteConfig({
  projectRoot: import.meta.dirname,
  enableDevtools: true, // 启用 Vue DevTools
  enableCompression: true,
  enableVisualizer: true,
})
