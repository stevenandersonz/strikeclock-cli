function list(yargs, cliStore) {
  yargs.command(
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
  );
}

module.exports = { list };
