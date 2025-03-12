const fs = require("fs");
const { glob } = require("glob");
const { exec } = require("child_process");

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function concatCssFiles(source, output) {
  try {
    // Use glob to match all css files in the source files
    const files = await glob(source);

    // Concatenate the content of all matched CSS files
    const combinedCss = files
      .map((file) => fs.readFileSync(file, "utf8"))
      .join("");

    // Write the combined content to output css file
    fs.writeFileSync(output, combinedCss);
  } catch (error) {
    console.error("Error concatenating CSS files:", error);
    process.exit(1);
  }
}

async function executeCommands() {
  try {
    console.log("Building base CSS files");
    await runCommand("npm run build:postcss-base");
    console.log("Concatenating base CSS files");
    await concatCssFiles("dist/base/*.css", "dist/base.css");
    console.log("Building pre JSS base CSS files");
    await runCommand("npm run build:prejss-base");
    console.log("Done building base CSS files");

    console.log("Building utilities CSS files");
    await runCommand("npm run build:postcss-utilities");
    console.log("Concatenating utilities CSS files");
    await concatCssFiles("dist/utilities/*.css", "dist/utilities.css");
    console.log("Building pre JSS utilities CSS files");
    await runCommand("npm run build:prejss-utilities");
    console.log("Done building utilities CSS files");

    console.log("Building components CSS files");
    await runCommand("npm run build:postcss-components");
    console.log("Concatenating components CSS files");
    await concatCssFiles("dist/components/*.css", "dist/components.css");
    console.log("Building pre JSS components CSS files");
    await runCommand("npm run build:prejss-components");
    console.log("Done building components CSS files");
  } catch (error) {
    console.error("Error executing commands:", error);
  }
}

// Run the commands asynchronously
executeCommands();
