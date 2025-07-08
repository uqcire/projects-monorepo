const { createTailwindConfig } = require('@shared/tailwind-config')
const { cirqTheme } = require('@shared/tailwind-config/themes')

module.exports = createTailwindConfig({
  daisyui: true,
  extend: {
    daisyui: {
      themes: [
        "light",
        "dark",
        "cupcake",
        "emerald",
        "corporate",
        "synthwave",
        "retro",
        "cyberpunk",
        "valentine",
        "halloween",
        "garden",
        "forest",
        "aqua",
        "lofi",
        "pastel",
        "fantasy",
        "wireframe",
        "luxury",
        "dracula",
        "business",
        "autumn",
        "acid",
        "lemonade",
        "night",
        "coffee",
        "winter",
        "dim",
        "nord",
        "sunset",
        cirqTheme.cirq,
      ],
    },
  },
})
