const { orange } = require("./colors");
const prettyMS = require("pretty-ms");
class Duration {
  static toSeconds = (ms) => Math.round(ms / 1000);
  static toMinutes = (secs) => ({
    minutes: Math.round(secs / 60),
    secondsOffset: Math.round(secs % 60),
  });
  static toHours = (secs) => ({
    hours: Math.round(secs / 3600),
    minutesOffset: Math.round(secs % 3600),
  });
  static objectifyDuration = (ms) => {
    const secs = Duration.toSeconds(ms);
    if (secs < 59) {
      return { hours: 0, minutes: 0, seconds: secs };
    }

    if (secs > 59 && secs < 3600) {
      const { minutes, secondsOffset } = Duration.toMinutes(secs);
      return {
        hours: 0,
        minutes,
        seconds: secondsOffset,
      };
    }

    if (secs >= 3600) {
      const { hours, minutesOffset } = Duration.toHours(secs);
      const { minutes, secondsOffset } = Duration.toMinutes(minutesOffset);
      return {
        hours,
        minutes,
        seconds: secondsOffset,
      };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  constructor(ms) {
    this.ms = ms;
    this.seconds = Math.floor((ms / 1000) % 60);
    this.minutes = Math.floor((ms / 1000 / 60) % 60);
    this.hours = Math.floor((ms / 1000 / 3600) % 24);
    this.verbose = `\n\t You worked for a total time of ${orange(
      this.hours > 0
        ? `${this.hours} hours, `
        : this.minutes > 0
        ? `${this.minutes} minutes and ${this.seconds} seconds.`
        : `${this.seconds} seconds `
    )}`;
    this.plain = {
      seconds: this.seconds,
      minutes: this.minutes,
      hours: this.hours,
    };
    this.humanized = prettyMS(ms);
  }
}

module.exports = { Duration };
