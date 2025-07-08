import { createTailwindConfig } from '@shared/tailwind-config'
import { dflmPreset } from '@shared/tailwind-config/presets'
import { dflmTheme } from '@shared/tailwind-config/themes'

export default createTailwindConfig({
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
