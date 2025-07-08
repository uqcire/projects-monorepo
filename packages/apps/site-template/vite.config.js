
import { createVueViteConfig } from '@monorepo/vite-config'

// https://vitejs.dev/config/
export default createVueViteConfig({
  projectRoot: import.meta.dirname,
  enableCompression: true,
  enableVisualizer: true,
})
