function strikeIn(yargs, cliStore) {
  yargs.command(
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
  );
}

module.exports = { strikeIn };
