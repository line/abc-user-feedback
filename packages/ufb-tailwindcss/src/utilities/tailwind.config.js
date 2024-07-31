const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [{ raw: "" }],
  safelist: [
    {
      pattern:
        /(bg|text|fill|border|text-above)-(red|orange|yellow|green|blue|navy|purple|inverse|)(-|)(primary|secondary|tertiary|quaternary|dim|)/,
    },
    {
      pattern:
        /shadow-(drop|top|bottom|floating-depth-1|floating-depth-2|floating-depth-3)/,
    },
  ],
  theme: require("../theme"),
  plugins: [
    plugin(({ addBase }) => {
      addBase(require("../../dist/base"));
    }),
  ],
};
