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
}

const baseSizes = {
  header: '80px',
  body: 'calc(100vh - 60px)',
  logo: '200px',
  favorites: '300px',

  'header-m': '60px',
  'logo-m': '160px',
}

module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      height: {
        ...baseSizes,
      },
      minHeight: {
        ...baseSizes,
      },
      maxHeight: {
        ...baseSizes,
      },
      width: {
        ...baseSizes,
      },
      minWidth: {
        ...baseSizes,
      },
      maxWidth: {
        ...baseSizes,
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
    },
  },
  corePlugins: {},
}
