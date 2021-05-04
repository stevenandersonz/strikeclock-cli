function humanize(ms) {
    return toHours(toSeconds(ms));
}
const toSeconds = (ms) => Math.round(ms / 1000);

const toMinutes = (secs) => secs / 60;

const toHours = (secs) => {
    if (secs < 59) {
        return { hours: 0, minutes: 0, seconds: secs };
    }

    if (secs > 59 && secs < 3600) {
        return { hours: 0, minutes: Math.round(secs / 60), seconds: Math.round(secs / 60) };
    }

    if (secs >= 3600) {
        let hours = secs / 3600;
        let hoursOffset = secs % 3600;
        let minutes = hoursOffset / 60;
        let seconds = hoursOffset % 60;
        return { hours: hours, minutes: Math.round(minutes), seconds: Math.round(seconds) };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
};
module.exports = { humanize };
