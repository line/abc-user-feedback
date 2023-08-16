const colors = require('./colors');

module.exports = {
  colors: {
    fill: {
      primary: 'var(--fill-color-primary)',
      secondary: 'var(--fill-color-secondary)',
      tertiary: 'var(--fill-color-tertiary)',
      quaternary: 'var(--fill-color-quaternary)',
      inverse: 'var(--fill-color-inverse)',
    },
    ...colors,
  },
  textColor: {
    primary: 'var(--text-color-primary)',
    secondary: 'var(--text-color-secondary)',
    tertiary: 'var(--text-color-tertiary)',
    quaternary: 'var(--text-color-quaternary)',
    inverse: 'var(--text-color-inverse)',
    above: {
      primary: 'var(--text-above-color-primary)',
      secondary: 'var(--text-above-color-secondary)',
      tertiary: 'var(--text-above-color-tertiary)',
      quaternary: 'var(--text-above-color-quaternary)',
      ...colors,
    },
    fill: {
      primary: 'var(--fill-color-primary)',
      secondary: 'var(--fill-color-secondary)',
      tertiary: 'var(--fill-color-tertiary)',
      quaternary: 'var(--fill-color-quaternary)',
      inverse: 'var(--fill-color-inverse)',
    },
    ...colors,
  },
  backgroundColor: {
    primary: 'var(--background-color-primary)',
    secondary: 'var(--background-color-secondary)',
    tertiary: 'var(--background-color-tertiary)',
    dim: 'var(--background-color-dim)',
    fill: {
      primary: 'var(--fill-color-primary)',
      secondary: 'var(--fill-color-secondary)',
      tertiary: 'var(--fill-color-tertiary)',
      quaternary: 'var(--fill-color-quaternary)',
      inverse: 'var(--fill-color-inverse)',
    },
    ...colors,
  },
  borderRadius: {
    DEFAULT: '8px',
    full: '99999px',
    none: '0',
  },
};
