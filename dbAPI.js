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
        const punch = await getPunchById(punchId);
        await db.put(punchId, JSON.stringify({ ...punch, punchOutAt: new Date().getTime(), note }));
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

module.exports = { createPunchIn, createPunchOut, getPunchById };
