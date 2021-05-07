#!/usr/bin/env node
const { cliStore } = require("./cli.store");
const yargs = require("yargs");
const cmds = require("./commands");
function startCLI() {
  cliStore.setup().then(() => {
    yargs.scriptName("skclock").usage("$0 <cmd> [args]");
    Object.values(cmds(yargs)).forEach((cmd) => cmd());
    yargs.help;
    yargs.argv;
  });
}

startCLI();
