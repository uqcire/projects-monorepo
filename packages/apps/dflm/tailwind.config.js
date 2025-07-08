const { createTailwindConfig } = require('@shared/tailwind-config')
const { dflmPreset } = require('@shared/tailwind-config/presets')
const { dflmTheme } = require('@shared/tailwind-config/themes')

module.exports = createTailwindConfig({
  daisyui: true,
  extend: {
    ...dflmPreset,
    daisyui: {
      themes: [
        "light",
        "dark",
        "cupcake",
        "emerald",
        "corporate",
        "retro",
        "garden",
        "forest",
        "lofi",
        "pastel",
        "fantasy",
        "wireframe",
        "luxury",
        "business",
        "autumn",
        "coffee",
        "winter",
        "dim",
        "nord",
        "sunset",
        dflmTheme["dflm-brand"],
      ],
    },
  },
})
