#!/usr/bin/env node
const { cliStore } = require("./cli.store");
const yargs = require("yargs");

function startCLI() {
  cliStore.setup().then(() => {
    yargs
      .scriptName("skclock")
      .usage("$0 <cmd> [args]")
      .command(
        "in [project]",
        "Strike into a project",
        (yargs) => {
          yargs.positional("project", {
            type: "string",
            default: "default",
            describe: "the project to strike time in",
          });
        },
        cliStore.strikeIn
      )
      .command(
        "out",
        "Strike out of a project",
        (yargs) => {
          yargs.option("n", {
            alias: "note",
            describe: "appends a note to the strike",
            type: "string",
          });
        },
        cliStore.strikeOut
      )
      .command(
        "list [project]",
        "List all the strikes for a particular project",
        (yargs) => {
          yargs.positional("project", {
            type: "string",
            default: "default",
            describe: "List the punch of a specific project",
          });
          yargs.option("s", {
            alias: "short",
            describe: "Display the total amount of time worked in a project",
          });
          yargs.option("h", {
            alias: "html",
            describe: "Creates a html report file",
          });
        },
        cliStore.listPunchByProject
      )
      .command("clear", "Deletes all strike records", cliStore.clear)
      .help().argv;
  });
}

startCLI();
