const dbAPI = require("./dbAPI");
const pug = require("pug");
const open = require("open");
const { red, blue, purple, orange } = require("./colors.js");
const { formatError, formatInfo, formatLog } = require("./utils");
const { getProjectHTMLReport, getShortProjectReport } = require("./data-utils");
const { Duration } = require("./date-utils.js");
const fs = require("fs/promises");
const path = require("path");

class CLIStore {
  constructor(
    exportPath = path.normalize("./reports"),
    templatePath = path.normalize("./reports/templates"),
    args
  ) {
    this.exportPath = exportPath;
    this.templatePath = templatePath;
    this.LAST_PUNCH_ID = "";
    this.args = args;
    this.info = (t, d) => console.info(formatInfo(t, d));
    this.error = (t, d) => console.error(formatError(t, d));
    this.log = (t, d) => console.log(formatLog(t, d));
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
      this.error("REPORT FAILED", e);
    }
  }

  computeReport(type) {
    const reportPath = path.join(this.exportPath, `${type}.html`);
    const compileFunction = pug.compileFile(
      path.join(this.templatePath, `${type}.pug`)
    );
    return async (data) =>
      this.reportGenerator(reportPath, compileFunction, data);
  }
  async setup() {
    this.LAST_PUNCH_ID = await dbAPI.getLastPunchId();
  }
  async strikeIn({ project }) {
    try {
      console.log(this);
      if (this.LAST_PUNCH_ID !== "0")
        return this.error(
          `PUNCH_ID:${this.LAST_PUNCH_ID}`,
          "You need to punch out first \n"
        );

      const punch = await dbAPI.createPunchIn({ project });
      await dbAPI.saveLastPunchId(punch.id);
      this.info(
        project,
        `Punched in at ${purple(new Date(punch.punchInAt).toLocaleString())}`
      );
    } catch (e) {
      this.error("STRIKEIN FAILURE", e);
    }
  }

  async strikeOut() {
    const punch = await dbAPI.createPunchOut({
      punchId: this.LAST_PUNCH_ID,
      note: "this is a note",
    });
    await dbAPI.saveLastPunchId(0);

    const duration = new Duration(punch.punchOutAt - punch.punchInAt);

    this.info(
      punch.project,
      `Punched out at ${purple(new Date(punch.punchOutAt).toLocaleString())} ${
        duration.verbose
      }`
    );
  }

  async getPunch({ punchId }) {
    const punch = await dbAPI.getPunchById(punchId);
    this.log(
      punchId,
      `Punch In at: 
      ${punch.punchInAt}
      \n project:
      ${punch.project}`
    );
  }
  async clear() {
    try {
      await dbAPI.clear();
      this.log("SUCCESS", "all records were deleted");
    } catch (e) {
      this.error("ERR", e);
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
      this.error("Error RPRT", e);
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

module.exports = binder(new CLIStore());
