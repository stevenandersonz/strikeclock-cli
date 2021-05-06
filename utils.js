const { red, blue, purple } = require("./colors");

function formatError(err, description) {
  return `[${red(err)}] - ${description}`;
}

function formatInfo(title, description) {
  return `[${blue(title)}] ${description}`;
}

function formatLog(title, description) {
  return `[${purple(title)}] ${description}`;
}

module.exports = {
  formatError,
  formatInfo,
  formatLog,
};
