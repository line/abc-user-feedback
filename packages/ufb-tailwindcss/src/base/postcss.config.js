import postcssImport from "postcss-import";
import tailwindcssNesting from "tailwindcss/nesting/index.js";

export default {
  plugins: [postcssImport, tailwindcssNesting],
};
