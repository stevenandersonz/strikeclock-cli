#!/usr/bin/env node

const yargs = require("yargs");
const dbAPI = require("./dbAPI");
const { red, blue, purple, orange } = require("./colors.js");
const { humanize } = require("./date-utils.js");
const fs = require("fs/promises");

async function cli() {
    const LAST_PUNCH_ID = await dbAPI.getLastPunchId();
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
        if (LAST_PUNCH_ID !== "0") {
            return console.log(
                `⚠️  ${red(`[PUNCH_ID:${LAST_PUNCH_ID}]`)} You need to punch out first \n`
            );
        }

        const punch = await dbAPI.createPunchIn({ project });
        await dbAPI.saveLastPunchId(punch.id);
        const out = `
        [${blue(project)}] Punched in at ${purple(new Date(punch.punchInAt).toLocaleString())}
        `;
        console.log(out);
    };
}

function punchOut(punchId) {
    return async () => {
        const punch = await dbAPI.createPunchOut({ punchId, note: "this is a note" });
        await dbAPI.saveLastPunchId(0);

        const duration = humanize(punch.punchOutAt - punch.punchInAt);
        const out = `
        [${blue(punch.project)}] Punched out at ${purple(
            new Date(punch.punchOutAt).toLocaleString()
        )}
        \n\t You worked for a total time of ${orange(
            duration.hours > 0
                ? `${duration.hours} hours, `
                : duration.minutes > 0
                ? `${duration.minutes} minutes and ${duration.seconds} seconds.`
                : `${duration.seconds} seconds `
        )}
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
