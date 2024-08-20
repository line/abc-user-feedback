const theme = require("tailwindcss/defaultTheme");
const borderRadius = require("./borderRadius");
const boxShadow = require("./boxShadow");
const fontSize = require("./fontSize");
const spacing = require("./spacing");

const colors = {
  inherit: "inherit",
  current: "currentColor",
};

module.exports = {
  ...theme,
  colors,
  fill: {
    ...colors,
    neutral: {
      primary: "var(--text-neutral-primary)",
      secondary: "var(--text-neutral-secondary)",
      tertiary: "var(--text-neutral-tertiary)",
      inverse: "var(--text-neutral-inverse)",
      disabled: "var(--text-neutral-disabled)",
      static: "var(--text-neutral-static)",
    },
    tint: {
      red: "var(--text-tint-red)",
      orange: "var(--text-tint-orange)",
      green: "var(--text-tint-green)",
      blue: "var(--text-tint-blue)",
    },
  },
  textColor: {
    ...colors,
    neutral: {
      primary: "var(--text-neutral-primary)",
      secondary: "var(--text-neutral-secondary)",
      tertiary: "var(--text-neutral-tertiary)",
      inverse: "var(--text-neutral-inverse)",
      disabled: "var(--text-neutral-disabled)",
      static: "var(--text-neutral-static)",
    },
    tint: {
      red: "var(--text-tint-red)",
      orange: "var(--text-tint-orange)",
      green: "var(--text-tint-green)",
      blue: "var(--text-tint-blue)",
    },
  },
  backgroundColor: {
    ...colors,
    neutral: {
      primary: "var(--fg-neutral-primary)",
      secondary: "var(--fg-neutral-secondary)",
      tertiary: "var(--fg-neutral-tertiary)",
      inverse: "var(--fg-neutral-inverse)",
      disabled: "var(--fg-neutral-disabled)",
      hover: "var(--fg-neutral-hover)",
      transparent: "var(--base-transparent)",
    },
    primary: "var(--bg-primary)",
    secondary: "var(--bg-secondary)",
    tertiary: "var(--bg-tertiary)",
    dim: "var(--bg-dim)",
    tint: {
      red: {
        bold: "var(--fg-tint-red-bold)",
        subtle: "var(--fg-tint-red-subtle)",
        hover: "var(--fg-tint-red-hover)",
      },
      orange: {
        bold: "var(--fg-tint-orange-bold)",
        subtle: "var(--fg-tint-orange-subtle)",
        hover: "var(--fg-tint-orange-hover)",
      },
      green: {
        bold: "var(--fg-tint-green-bold)",
        subtle: "var(--fg-tint-green-subtle)",
        hover: "var(--fg-tint-green-hover)",
      },
      blue: {
        bold: "var(--fg-tint-blue-bold)",
        subtle: "var(--fg-tint-blue-subtle)",
        hover: "var(--fg-tint-blue-hover)",
      },
    },
  },
  borderColor: {
    neutral: {
      primary: "var(--border-neutral-primary)",
      secondary: "var(--border-neutral-secondary)",
      tertiary: "var(--border-neutral-tertiary)",
      disabled: "var(--border-neutral-disabled)",
      transparent: "var(--border-neutral-transparent)",
    },
    tint: {
      red: "var(--border-tint-red)",
      orange: "var(--border-tint-orange)",
      green: "var(--border-tint-green)",
      blue: "var(--border-tint-blue)",
    },
  },
  borderRadius,
  boxShadow,
  fontSize,
  spacing,
};
