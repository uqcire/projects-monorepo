import { getProjectConfig } from '@monorepo/vitest-config'
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  const config = await getProjectConfig('basketball-score')
  return config
})
