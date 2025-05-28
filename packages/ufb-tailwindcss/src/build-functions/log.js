const log = {
  info: (message) =>
    console.log(
      `\x1b[36m[INFO]\x1b[0m ${new Date().toLocaleTimeString()} - ${message}`,
    ),
  success: (message) =>
    console.log(
      `\x1b[32m[SUCCESS]\x1b[0m ${new Date().toLocaleTimeString()} - ${message}`,
    ),
  error: (error) =>
    console.error(
      `\x1b[31m[ERROR]\x1b[0m ${new Date().toLocaleTimeString()} - ${error}`,
    ),
  step: (step, total, message) =>
    console.log(`\x1b[35m[${step}/${total}]\x1b[0m \x1b[33m${message}\x1b[0m`),
};
module.exports = log;
