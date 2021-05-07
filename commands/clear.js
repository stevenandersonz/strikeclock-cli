function clear(yargs, cliStore) {
  yargs.command("clear", "Deletes all strike records", cliStore.clear);
}

module.exports = { clear };
