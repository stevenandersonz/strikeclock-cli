const fs = require("fs");
const R = require("ramda");
const { cliStore } = require("../cli.store");

function commands(yargs) {
  let files = fs.readdirSync("./commands");
  const cmds = {};
  files.forEach((file) => {
    if (R.not(R.equals(file, "index.js"))) {
      Object.entries(require(`./${file}`)).forEach(([key, value]) => {
        cmds[key] = R.partial(value, [yargs, cliStore]);
      });
    }
  });
  return cmds;
}

module.exports = (yargs) => commands(yargs);
