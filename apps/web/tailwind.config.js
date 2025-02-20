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
      boxShadow: {
        sm: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        default:
          '0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
        md: '0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.10), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: '0px 2px 4px 0px rgba(0, 0, 0, 0.06) inset',
        none: 'none',
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
    require('@headlessui/tailwindcss'),
  ],
};
