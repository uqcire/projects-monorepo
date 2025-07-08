const { createTailwindConfig } = require('@shared/tailwind-config')
const { gcnPreset } = require('@shared/tailwind-config/presets')

module.exports = createTailwindConfig({
  daisyui: false,
  preflight: false,
  content: ['./src/**/*.{vue,js,ts}'],
  extend: gcnPreset,
});
