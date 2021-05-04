#!/usr/bin/env node

const yargs = require("yargs");
const dbAPI = require("./dbAPI");
const { red, blue, purple } = require("./colors.js");
const { humanize } = require("./date-utils.js");
const fs = require("fs/promises");
async function saveLastPunchId(id) {
    try {
        await fs.writeFile("./.pclock.json", JSON.stringify({ LAST_PUNCH_ID: id }), "utf8");
    } catch (err) {
        console.log(err);
    }
}

async function loadLastPunchId() {
    try {
        const data = await fs.readFile("./.pclock.json", "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.log(err);
    }
}
async function cli() {
    const punchSettings = await loadLastPunchId();
    const { LAST_PUNCH_ID } = punchSettings;
    yargs
        .scriptName("punching-clock")
        .usage("$0 <cmd> [args]")
        .command(
            "in [project]",
            "",
            (yargs) => {
                yargs.positional("project", {
                    type: "string",
                    default: "default",
                    describe: "the project to punch time in",
                });
            },
            punchIn(LAST_PUNCH_ID)
        )
        .command(
            "out [id]",
            "",
            (yargs) => {
                yargs.positional("id", {
                    type: "string",
                    default: LAST_PUNCH_ID,
                    describe: "punching out of a project",
                });
            },
            punchOut(LAST_PUNCH_ID)
        )
        .help().argv;
}

function punchIn(LAST_PUNCH_ID) {
    return async ({ project }) => {
        if (LAST_PUNCH_ID) {
            return console.log(
                `⚠️  ${red(
                    `[PUNCH_ID:${LAST_PUNCH_ID}]`
                )} You currently are working on a project please punch out first \n`
            );
        }

        const punch = await dbAPI.createPunchIn({ project });
        await saveLastPunchId(punch.id);

        const out = `
        ${blue(`----------------------------------------------\n
                         PUNCH IN\n
        ----------------------------------------------\n`)}
        \nProject: ${punch.project}
        \nRegistered at: ${new Date(punch.punchOutAt)}
        \nID: ${punch.id}
        ${blue(`
        ----------------------------------------------\n
`)}
        `;
        console.log(out);
    };
}

function punchOut(punchId) {
    return async () => {
        const punch = await dbAPI.createPunchOut({ punchId, note: "this is a note" });
        saveLastPunchId(null);
        console.log(punch);
        const out = `
        ${blue(`----------------------------------------------\n
                         PUNCH OUT\n
        ----------------------------------------------\n`)}
        \nProject: ${punch.project}
        \nRegistered at: ${new Date(punch.punchOutAt)}
        \nNote: ${punch.note}
        \nTotal Time: ${JSON.stringify(humanize(punch.punchOutAt - punch.punchInAt))}
        \nID: ${punch.id}

        ${blue(`----------------------------------------------\n`)}

        `;
        console.log(out);
    };
}

async function getPunch({ punchId }) {
    const punch = await dbAPI.getPunchById(punchId);

    console.log("Punch In at: ", punch.punchInAt, "\n project:", punch.project, "\n id: ", punchId);
}

//getPunch({ punchId: "fba39314-35a8-4bbd-98a7-9ef083ff3426" });

cli();
