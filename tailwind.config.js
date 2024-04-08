/** @type {import('tailwindcss').Config} */

import { themeDark } from './src/theme/material-ui/dark'

const baseColors = {
  ...themeDark,

  header: 'rgba(255, 255, 255, 0.5)',
  favorite: 'rgba(255, 255, 255, 0.8)',
  'header-dark': 'rgba(0, 0, 0, 0.5)',
  'favorite-dark': 'rgba(0, 0, 0, 0.8)',
  rise: '#6cc825',
  fall: '#fa541c',
  sky: '#b6fafe',
}

const baseWidths = {
  logo: '200px',
  chat: '1140px',
  bubble: '365px',
  'logo-m': '160px',
}

const baseHeights = {
  header: '65px',
  body: 'calc(100vh - 65px)',
  favorite: 'calc(100vh - 65px)',
  'header-m': '60px',
}

module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        bubble: '2px 2px 2px 1px rgb(0,0,0,0.3)',
      },

      width: {
        ...baseWidths,
      },
      minWidth: {
        ...baseWidths,
      },
      maxWidth: {
        ...baseWidths,
      },

      height: {
        ...baseHeights,
      },
      minHeight: {
        ...baseHeights,
      },
      maxHeight: {
        ...baseHeights,
      },

      textColor: {
        ...baseColors,
      },
      borderColor: {
        ...baseColors,
      },
      backgroundColor: {
        ...baseColors,
      },
      colors: {
        ...baseColors,
      },
    },
  },
  corePlugins: {},
  plugins: [require('tailwindcss-animated')],
}
