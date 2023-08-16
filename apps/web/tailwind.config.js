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
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
    require('path').join(__dirname, '../../packages/ufb-ui/src/**/*.{ts,tsx}'),
  ],
  plugins: [
    require('@ufb/tailwind'),
    require('tailwind-scrollbar-hide'),
    require('@headlessui/tailwindcss'),
  ],
};
