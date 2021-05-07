const dbAPI = require("./dbAPI");
const pug = require("pug");
const open = require("open");
const R = require("ramda");
const { purple } = require("./colors.js");
const { formatError, formatInfo, formatSuccess } = require("./utils");
const { getProjectHTMLReport, getShortProjectReport } = require("./data-utils");
const { Duration } = require("./date-utils.js");
const fs = require("fs/promises");
const path = require("path");

const emptyFunction = R.identity(() => {});

const safeLog = R.curry((test, logger) =>
  R.ifElse(() => R.not(test), logger, emptyFunction)
);

class CLIStore {
  constructor(
    exportPath = path.normalize("./reports"),
    templatePath = path.normalize("./reports/templates"),
    args
  ) {
    this.exportPath = exportPath;
    this.templatePath = templatePath;
    this.lastStrikeId = "";
    this.args = args;
    this.test = false;
    this.safeLog = safeLog(this.test);
    this.success = this.safeLog((msg) => console.info(formatSuccess(msg)));
    this.info = this.safeLog((title, desc) =>
      console.info(formatInfo(title, desc))
    );
    this.error = this.safeLog((err) => console.error(formatError(err)));
    this.table = console.table;
  }
  async reportGenerator(reportPath, compileFunction, data) {
    try {
      await fs.writeFile(
        reportPath,
        compileFunction({
          dataList: data,
        })
      );
      open(reportPath);
    } catch (e) {
      this.error(e);
    }
  }

  computeReport(type) {
    const reportPath = path.join(this.exportPath, `${type}.html`);
    const compileFunction = pug.compileFile(
      path.join(this.templatePath, `${type}.pug`)
    );
    return async (data) =>
      await this.reportGenerator(reportPath, compileFunction, data);
  }
  async setup() {
    try {
      this.lastStrikeId = await dbAPI.getLastPunchId();
    } catch (e) {
      this.error(e);
    }
  }
  async strikeIn({ project }) {
    try {
      if (this.lastStrikeId !== "0")
        return this.error("You need to punch out first \n");

      const punch = await dbAPI.createPunchIn({ project });
      await dbAPI.saveLastPunchId(punch.id);

      this.info(
        project,
        `Punched in at ${purple(new Date(punch.punchInAt).toLocaleString())}`
      );

      return [true, punch.id];
    } catch (e) {
      this.error(e);
    }
  }

  async strikeOut({ n, note }) {
    try {
      const punch = await dbAPI.createPunchOut({
        id: this.lastStrikeId,
        note: n || note ? n : "",
      });
      await dbAPI.saveLastPunchId(0);

      const duration = new Duration(punch.punchOutAt - punch.punchInAt);

      this.info(
        punch.project,
        `Punched out at ${purple(
          new Date(punch.punchOutAt).toLocaleString()
        )} ${duration.verbose}`
      );

      return [true, this.lastStrikeId];
    } catch (e) {
      this.error(e);
    }
  }

  async getStrike({ id }) {
    return await dbAPI.getPunchById(id);
  }
  async clear() {
    try {
      await dbAPI.clear();
      this.success("all records were deleted");
    } catch (e) {
      this.error(e);
    }
  }
  async listPunchByProject({ project, s, short, h, html, ...rest }) {
    try {
      const punchList = await dbAPI.getPunchByProject(project);
      if (s || short) {
        let shortReport = getShortProjectReport(punchList);

        return console.table(shortReport);
      }
      if (h || html) {
        return await this.computeReport("project")(
          getProjectHTMLReport(punchList)
        );
      }

      this.table(getProjectHTMLReport(punchList));
    } catch (e) {
      this.error(e);
    }
  }
}

function binder(target) {
  const handler = {
    get(target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== "function") {
        return value;
      }
      return value.bind(target);
    },
  };

  const proxy = new Proxy(target, handler);
  return proxy;
}

const cliStore = binder(new CLIStore());

module.exports = { cliStore };
