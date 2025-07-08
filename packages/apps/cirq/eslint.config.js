import unocss from '@unocss/eslint-config/flat'
import baseConfig from '../eslint.config.js'

export default [
  ...baseConfig,
  {
    plugins: {
      unocss,
    },
  },
]
