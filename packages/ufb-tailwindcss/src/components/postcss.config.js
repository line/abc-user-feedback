import postcssImport from "postcss-import";
import tailwindcssNesting from "tailwindcss/nesting/index.js";
import tailwindcss from "tailwindcss";

export default {
  plugins: [
    postcssImport,
    tailwindcssNesting,
    tailwindcss("./src/components/tailwind.config.js"),
  ],
};
