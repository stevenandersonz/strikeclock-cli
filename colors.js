const chalk = require("chalk");

function toColor(color) {
    return (str) => chalk.hex(color)(str);
}

const blue = toColor("#a5d6ff");
const red = toColor("#ff7b72");
const purple = toColor("#d2a8ff");
const orange = toColor("#ffa657");
module.exports = { blue, red, purple, orange };
