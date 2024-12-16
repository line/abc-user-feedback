const theme = require("tailwindcss/defaultTheme");
const borderRadius = require("./borderRadius");
const boxShadow = require("./boxShadow");
const spacing = require("./spacing");

const colors = {
  inherit: "inherit",
  current: "currentColor",
};

/** @type {import("tailwindcss").Config["theme"]} */
module.exports = {
  ...theme,
  colors,
  fill: {
    ...colors,
    neutral: {
      primary: "var(--icon-neutral-primary)",
      secondary: "var(--icon-neutral-secondary)",
      tertiary: "var(--icon-neutral-tertiary)",
      inverse: "var(--icon-neutral-inverse)",
      static: "var(--icon-neutral-static)",
    },
    tint: {
      red: "var(--icon-tint-red)",
      orange: "var(--icon-tint-orange)",
      green: "var(--icon-tint-green)",
      blue: "var(--icon-tint-blue)",
    },
  },
  textColor: {
    ...colors,
    neutral: {
      primary: "var(--text-neutral-primary)",
      secondary: "var(--text-neutral-secondary)",
      tertiary: "var(--text-neutral-tertiary)",
      inverse: "var(--text-neutral-inverse)",
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
      },
      orange: {
        bold: "var(--fg-tint-orange-bold)",
        subtle: "var(--fg-tint-orange-subtle)",
      },
      green: {
        bold: "var(--fg-tint-green-bold)",
        subtle: "var(--fg-tint-green-subtle)",
      },
      blue: {
        bold: "var(--fg-tint-blue-bold)",
        subtle: "var(--fg-tint-blue-subtle)",
      },
    },
  },
  borderColor: {
    neutral: {
      primary: "var(--border-neutral-primary)",
      secondary: "var(--border-neutral-secondary)",
      tertiary: "var(--border-neutral-tertiary)",
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
  extend: {
    spacing,
  },
};
