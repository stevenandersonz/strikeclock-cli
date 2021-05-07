function strikeOut(yargs, cliStore) {
  yargs.command(
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
  );
}

module.exports = { strikeOut };
