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
    boxShadow: {
      drop: '0px 4px 16px 0px rgb(var(--shadow-rgb) / 20%)',
      top: '0 -0.031rem 0 rgb(var(--shadow-rgb) / 10%)',
      bottom: '0 0.031rem 0 rgb(var(--shadow-rgb) / 10%)',
      'floating-depth-1': '0 0 0.063rem rgb(var(--shadow-rgb) / 30%)',
      'floating-depth-2': '0 0.25rem 0.5rem rgb(var(--shadow-rgb) / 10%)',
      'floating-depth-3': '0 0.25rem 1rem rgb(var(--shadow-rgb) / 20%)',
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
