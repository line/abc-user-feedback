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
    extend: {
      borderRadius: {
        0: '0',
        4: '0.25rem',
        6: '0.375rem',
        8: '0.5rem',
        12: '0.75rem',
        16: '1rem',
        20: '1.25rem',
        24: '1.5rem',
        full: '62.4375rem',
      },
    },
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    require('path').join(__dirname, '../../packages/ufb-ui/src/**/*.{ts,tsx}'),
    require('path').join(
      __dirname,
      '../../packages/ufb-react/src/**/*.{ts,tsx}',
    ),
  ],
  plugins: [
    require('@ufb/tailwindcss'),
    // @ts-ignore
    require('tailwind-scrollbar-hide'),
  ],
};
