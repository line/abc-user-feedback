const plugin = require('tailwindcss/plugin');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [{ raw: '' }],
  theme: require('../theme'),
  plugins: [
    plugin(({ addBase, addUtilities }) => {
      addBase(require('../../dist/base'));
      addUtilities(require('../../dist/utilities'));
    }),
  ],
};
