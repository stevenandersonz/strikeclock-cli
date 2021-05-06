# Strike Clock

A Minimalist and private time tracker for users that love using the terminal.

## Install

You can installed it directly from npm with
`npm install -g strike-clock`

You can build it from the repo

1. `git clone git@github.com:stevenandersonz/strikeclock-cli.git`
2. `cd strikeclock-cli`
3. `npm install`

## Commands

- `skclock in <project-name>` start the time tracker
- `skclock out` stop the time tracker.
  - `skclock out -n="This is a note"` Append a note to the strike
- `skclock list <project-name>` list all strikes for a particular project
  - `skclock list <project-name> -s` Show the amount of time spend on a project
  - `skclock list <project-name> -h` Export the table to an html file and open it
- `skclock clear` Deletes all the strikes for all projects
