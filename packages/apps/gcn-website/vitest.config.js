import { getProjectConfig } from '@monorepo/vitest-config'
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  const config = await getProjectConfig('gcn-website')
  return config
})
