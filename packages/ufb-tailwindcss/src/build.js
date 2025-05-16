const generateCss = require("./build-functions/generate-css");
const mergeCss = require("./build-functions/merge-css");
const convertCssToJs = require("./build-functions/convert-css-to-js");
const log = require("./build-functions/log");

async function executeCommands() {
  try {
    const totalSteps = 9;
    let currentStep = 0;

    log.info("Starting CSS build process...");

    // Base CSS processing
    log.step(++currentStep, totalSteps, "Generating base CSS files");
    await generateCss("base");

    log.step(++currentStep, totalSteps, "Merging base CSS files");
    await mergeCss("base");

    log.step(++currentStep, totalSteps, "Converting base CSS to JS");
    await convertCssToJs("base");
    log.success("Base CSS processing completed");

    // Utilities CSS processing
    log.step(++currentStep, totalSteps, "Generating utilities CSS files");
    await generateCss("utilities");

    log.step(++currentStep, totalSteps, "Merging utilities CSS files");
    await mergeCss("utilities");

    log.step(++currentStep, totalSteps, "Converting utilities CSS to JS");
    await convertCssToJs("utilities");
    log.success("Utilities CSS processing completed");

    // Components CSS processing
    log.step(++currentStep, totalSteps, "Generating components CSS files");
    await generateCss("components");

    log.step(++currentStep, totalSteps, "Merging components CSS files");
    await mergeCss("components");

    log.step(++currentStep, totalSteps, "Converting components CSS to JS");
    await convertCssToJs("components");
    log.success("Components CSS processing completed");

    log.success("All CSS files built successfully!");
  } catch (error) {
    log.error(`Error executing commands: ${error.message}`);
  }
}

executeCommands();
