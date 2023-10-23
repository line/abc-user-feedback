const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    {
      pattern:
        /(fill|text|bg|border|text-above)(-|)(red|orange|yellow|green|blue|navy|purple|inverse|fill|)(-|)(primary|secondary|tertiary|quaternary|dim|)/,
    },
  ],
  theme: require('../theme'),
  plugins: [
    plugin(({ addBase }) => {
      addBase(require('../../dist/layer/base'));
    }),
  ],
};
