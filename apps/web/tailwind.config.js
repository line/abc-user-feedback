/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    borderRadius: {
      DEFAULT: '8px',
      sm: '4px',
      full: '99999px',
      none: '0',
    },
    screens: {
      lg: '960px',
    },
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    require('path').join(__dirname, '../../packages/ufb-ui/src/**/*.{ts,tsx}'),
  ],
  plugins: [
    require('@ufb/tailwind'),
    // @ts-ignore
    require('tailwind-scrollbar-hide'),
    require('@headlessui/tailwindcss'),
  ],
};
