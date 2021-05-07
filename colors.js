const chalk = require("chalk");

function setColor(color) {
  return (str) => chalk.hex(color)(str);
}

const blue = setColor("#a5d6ff");
const red = setColor("#ff7b72");
const purple = setColor("#d2a8ff");
const orange = setColor("#ffa657");
const green = setColor("#5eba7d");
module.exports = { blue, red, purple, orange, green };
