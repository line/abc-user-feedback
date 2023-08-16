module.exports = require('tailwindcss/plugin')(
  ({ addBase, addComponents, addUtilities }) => {
    addBase(require('../dist/layer/base'));
    addComponents(require('../dist/layer/components'));
    addUtilities(require('../dist/layer/utilities'));
  },
);
