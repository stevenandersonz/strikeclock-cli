const { red, blue, purple, green } = require("./colors");

function formatError(err, description) {
  return `${red("[ERR]")} - ${description}`;
}
function formatSuccess(description) {
  return `${green("[SUCCESS]")} - ${description}`;
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
  formatSuccess,
};
