const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [{ raw: '' }],
  safelist: [
    {
      pattern:
        /(bg|text|fill|border|text-above)-(red|orange|yellow|green|blue|navy|purple|inverse|)(-|)(primary|secondary|tertiary|quaternary|dim|)/,
    },
  ],
  theme: require('../theme'),
  plugins: [
    plugin(({ addBase }) => {
      addBase(require('../../dist/base'));
    }),
  ],
};
