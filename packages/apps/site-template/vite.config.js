
import { createOptimizedProductionConfig } from '@monorepo/vite-config'

// https://vitejs.dev/config/
export default createOptimizedProductionConfig(import.meta.dirname)
