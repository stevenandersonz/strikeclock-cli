const level = require("level");
const { v4: uuidv4 } = require("uuid");
const db = level("punch-db");

async function createPunchIn({ project }) {
  try {
    const id = uuidv4();
    const punch = {
      project,
      punchInAt: new Date().getTime(),
      punchOutAt: false,
      note: "",
    };
    await db.put(id, JSON.stringify(punch));
    return { id, ...punch };
  } catch (e) {
    throw new Error("Couln't register punch");
  }
}
async function clear() {
  try {
    await db.clear();
  } catch (e) {
    throw new Error("Couln't delete");
  }
}
async function createPunchOut({ id, note }) {
  try {
    let punch = await getPunchById(id);
    punch = {
      ...punch,
      punchOutAt: new Date().getTime(),
      note,
    };
    await db.put(id, JSON.stringify(punch));
    return punch;
  } catch (e) {
    console.error(e);
  }
}

async function getPunchById(id) {
  try {
    const punch = JSON.parse(await db.get(id));
    return punch;
  } catch (e) {
    throw new Error("Couln't find a punch with that id");
  }
}

function getPunchByProject(project) {
  return new Promise((resolve, reject) => {
    const punchItems = [];
    db.createReadStream()
      .on("data", function (data) {
        if (data.key !== "LAST_PUNCH_ID") {
          let punch = JSON.parse(data.value);
          if (punch.project === project) {
            punchItems.push({
              id: data.key,
              ...punch,
            });
          }
        }
      })
      .on("end", () => {
        resolve(punchItems);
      });
  });
}

function getAllPunch() {
  return new Promise((resolve, reject) => {
    const punchItems = {};
    db.createReadStream()
      .on("data", function (data) {
        if (data.key !== "LAST_PUNCH_ID") {
          let punch = JSON.parse(data.value);
          punchItems[punch.project] = [
            ...punchItems[punch.project],
            { id: data.key, ...punch },
          ];
        }
      })
      .on("end", () => {
        resolve(punchItems);
      });
  });
}

async function getLastPunchId() {
  try {
    const lastPunchId = await db.get("LAST_PUNCH_ID");
    return lastPunchId;
  } catch (e) {
    await saveLastPunchId(0);
    return getLastPunchId();
  }
}

async function saveLastPunchId(lastPunchId) {
  try {
    await db.put("LAST_PUNCH_ID", lastPunchId);
    return true;
  } catch (e) {
    console.error(e);
  }
}
module.exports = {
  createPunchIn,
  createPunchOut,
  getPunchById,
  saveLastPunchId,
  getLastPunchId,
  getPunchByProject,
  getAllPunch,
  clear,
};
