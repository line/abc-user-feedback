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
      primary: "var(--fg-neutral-primary)",
      secondary: "var(--fg-neutral-secondary)",
      tertiary: "var(--fg-neutral-tertiary)",
      inverse: "var(--fg-neutral-inverse)",
      static: "var(--fg-neutral-static)",
    },
    tint: {
      red: "var(--fg-tint-red)",
      orange: "var(--fg-tint-orange)",
      green: "var(--fg-tint-green)",
      blue: "var(--fg-tint-blue)",
    },
  },
  textColor: {
    ...colors,
    neutral: {
      primary: "var(--fg-neutral-primary)",
      secondary: "var(--fg-neutral-secondary)",
      tertiary: "var(--fg-neutral-tertiary)",
      inverse: "var(--fg-neutral-inverse)",
      static: "var(--fg-neutral-static)",
    },
    tint: {
      red: "var(--fg-tint-red)",
      orange: "var(--fg-tint-orange)",
      green: "var(--fg-tint-green)",
      blue: "var(--fg-tint-blue)",
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
  backgroundColor: {
    ...colors,
    primary: "var(--bg-primary)",
    secondary: "var(--bg-secondary)",
    tertiary: "var(--bg-tertiary)",
    dim: "var(--bg-dim)",
    neutral: {
      primary: "var(--bg-neutral-primary)",
      secondary: "var(--bg-neutral-secondary)",
      tertiary: "var(--bg-neutral-tertiary)",
      inverse: "var(--bg-neutral-inverse)",
      hover: "var(--bg-neutral-hover)",
      transparent: "var(--base-transparent)",
    },
    tint: {
      red: {
        bold: "var(--bg-tint-red-bold)",
        subtle: "var(--bg-tint-red-subtle)",
      },
      orange: {
        bold: "var(--bg-tint-orange-bold)",
        subtle: "var(--bg-tint-orange-subtle)",
      },
      green: {
        bold: "var(--bg-tint-green-bold)",
        subtle: "var(--bg-tint-green-subtle)",
      },
      blue: {
        bold: "var(--bg-tint-blue-bold)",
        subtle: "var(--bg-tint-blue-subtle)",
      },
    },
  },
  borderRadius,
  boxShadow,
  extend: {
    spacing,
  },
};
