const { Duration } = require("./date-utils.js");
const prettyMS = require("pretty-ms");
function getShortProjectReport(data) {
  const report = data.reduce(
    (hist, punch) => {
      return {
        Time_Worked: [...hist.Time_Worked, punch.punchOutAt - punch.punchInAt],
        Punch_Count: hist.Punch_Count + 1,
        Project: punch.project,
      };
    },
    { Time_Worked: [], Punch_Count: 0, Project: "" }
  );
  let t = report.Time_Worked.reduce((a, b) => a + b);

  return [
    {
      ...report,
      Time_Worked: new Duration(t).humanized,
    },
  ];
}

function getProjectHTMLReport(data) {
  return data.map((punch) => ({
    id: punch.id,
    project: punch.project,
    in: new Date(punch.punchInAt).toLocaleString(),
    out: punch.punchOutAt
      ? new Date(punch.punchOutAt).toLocaleString()
      : "In Progress",
    duration: new Duration(punch.punchOutAt - punch.punchInAt).humanized,
    note: punch.note,
  }));
}

module.exports = {
  getProjectHTMLReport,
  getShortProjectReport,
};
