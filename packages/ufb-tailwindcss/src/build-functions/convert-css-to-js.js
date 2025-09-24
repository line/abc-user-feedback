const fs = require("fs/promises");
const path = require("path");
const postcss = require("postcss");
const postcssJs = require("postcss-js");

const camelToKebab = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
};

const transformKeys = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(transformKeys);
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [
        camelToKebab(key),
        typeof value === "object" ? transformKeys(value) : value,
      ];
    }),
  );
};

const replaceApplyTrueWithEmptyObject = (obj) => {
  const stack = [obj];

  while (stack.length > 0) {
    const currentObj = stack.pop();
    for (const [key, value] of Object.entries(currentObj)) {
      if (typeof value === "object" && value !== null) {
        stack.push(value);
      }

      if (key.startsWith("@apply") && value === true) {
        currentObj[key] = {};
      }
    }
  }
};

async function convertCssToJs(type = "base") {
  try {
    const inputPath = path.resolve(process.cwd(), `dist/${type}.css`);
    const outputPath = path.resolve(process.cwd(), `dist/${type}.js`);

    // Read the CSS file
    const cssContent = await fs.readFile(inputPath, "utf-8");

    // Parse the CSS and convert to JS object
    const root = postcss.parse(cssContent);
    const jsContent = postcssJs.objectify(root);
    const kebabCaseContent = transformKeys(jsContent);
    replaceApplyTrueWithEmptyObject(kebabCaseContent);

    // Convert JS object to string and format as a module
    const jsOutput = `module.exports = ${JSON.stringify(kebabCaseContent, null, 2)};\n`;

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Write the JS file
    await fs.writeFile(outputPath, jsOutput);

    // console.log(`Successfully converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error generating JS from CSS: ${error.message}`);
    throw error;
  }
}

module.exports = convertCssToJs;
