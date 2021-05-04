const level = require("level");
const { v4: uuidv4 } = require("uuid");
const db = level("punch-db");

async function createPunchIn({ project }) {
    try {
        const id = uuidv4();
        const punch = {
            id: id,
            project,
            punchInAt: new Date().getTime(),
            punchOutAt: false,
            note: "",
        };
        await db.put(id, JSON.stringify(punch));
        return punch;
    } catch (e) {
        throw new Error("Couln't register punch");
    }
}

async function createPunchOut({ punchId, note }) {
    try {
        let punch = await getPunchById(punchId);
        punch = {
            ...punch,
            punchOutAt: new Date().getTime(),
            note,
        };
        await db.put(punchId, JSON.stringify(punch));
        return punch;
    } catch (e) {
        throw new Error("Couln't register punch out");
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

async function getLastPunchId() {
    try {
        const lastPunchId = await db.get("LAST_PUNCH_ID");
        return lastPunchId;
    } catch (e) {
        console.log(e);
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
};
