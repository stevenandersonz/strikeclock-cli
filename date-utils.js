function humanize(ms) {
  return toHours(toSeconds(ms));
}
const toSeconds = (ms) => Math.round(ms / 1000);

const toMinutes = (secs) => Math.round(secs / 60);

const toHours = (secs) => {
  if (secs < 59) {
    return { hours: 0, minutes: 0, seconds: secs };
  }

  if (secs > 59 && secs < 3600) {
    return {
      hours: 0,
      minutes: toMinutes(secs),
      seconds: Math.round(secs % 60),
    };
  }

  if (secs >= 3600) {
    let hours = secs / 3600;
    let hoursOffset = secs % 3600;
    let minutes = toMinutes(hoursOffset);
    let seconds = Math.round(hoursOffset % 60);
    return {
      hours,
      minutes,
      seconds,
    };
  }
  return { hours: 0, minutes: 0, seconds: 0 };
};
module.exports = { humanize };
