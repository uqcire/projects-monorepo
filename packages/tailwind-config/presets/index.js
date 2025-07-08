const { fontFamily } = require('tailwindcss/defaultTheme')

/**
 * DFLM 项目预设配置
 */
const dflmPreset = {
  theme: {
    extend: {
      fontFamily: {
        pilar: ['pilar-pro', ...fontFamily.sans],
      },
    },
  },
}

/**
 * GCN Website 项目预设配置
 */
const gcnPreset = {
  theme: {
    container: { center: true },
    fontFamily: {
      fira: ['Fira Code'],
      work: ['Work Sans'],
      lato: ['Lato'],
      raleway: ['Raleway'],
      krona: ['Krona One'],
      tcsans: ['Noto Sans TC'],
      tcserif: ['Noto Serif TC'],
    },
    screens: {
      'sm': { min: '375px', max: '767px' },
      'md': { min: '768px', max: '1023px' },
      'lg': { min: '1024px', max: '1339px' },
      'xl': { min: '1440px', max: '1919px' },
      '2xl': { min: '1920px' },
    },
    spacing: {
      0: '0rem',
      1: '0.5rem',
      2: '1rem',
      3: '1.5rem',
      4: '2rem',
      5: '2.5rem',
      6: '3rem',
      7: '3.5rem',
      8: '4rem',
      9: '4.5rem',
      10: '5rem',
      11: '5.5rem',
      12: '6rem',
      13: '12rem',
      14: '24rem',
    },
    extend: {
      colors: {
        // brand
        'fgl-primary': '#092147', // Downriver
        'fgl-lime': '#c2d730', // Lime
        'fgl-coconut': '#f2f7d5', // Coconut Cream
        'fgl-valencia': '#db3e4d', // Valencia
        'gcn-keppel': '#36A692', // Keppel

        // status
        'fgl-success': '#207f4c', // Eucalyptus
        'fgl-info': '#d1d2d1', // Pumice
        'fgl-warning': '#ffd111', // Candlelight
        'fgl-error': '#cc2200', // Milano
        'fgl-text-color-1': '#2d2e36', // Charade
        'fgl-text-color-2': '#2b333e', // Ebony Clay
        'fgl-text-color-3': '#c8c9c7', // Kangaroo
        'fgl-border-color': '#939597', // Oslo Gray
      },
      fontSize: { caption: '0.64rem' },
    },
  },
}

/**
 * Basketball Score 项目预设配置（使用 DaisyUI）
 */
const basketballPreset = {
  // 使用默认配置 + DaisyUI
}

/**
 * Cirq 项目预设配置（使用 DaisyUI）
 */
const cirqPreset = {
  // 使用默认配置 + DaisyUI
}

/**
 * Site Template 项目预设配置（使用 DaisyUI）
 */
const siteTemplatePreset = {
  // 使用默认配置 + DaisyUI
}

module.exports = {
  dflmPreset,
  gcnPreset,
  basketballPreset,
  cirqPreset,
  siteTemplatePreset,
}
