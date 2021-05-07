const { cliStore } = require("../cli.store");
const { validate } = require("uuid");

beforeAll(async () => {
  await cliStore.clear();
  cliStore.test = true;
});

beforeEach(async () => {
  await cliStore.setup();
});

test("Can strike in", async () => {
  const [success, id] = await cliStore.strikeIn({ project: "default" });
  expect(success).toBe(true);
  expect(validate(id)).toBe(true);
});

test("Can strike out", async () => {
  const [okOut, idOut] = await cliStore.strikeOut({
    n: "1",
    note: "1",
  });
  expect(okOut).toBe(true);
  expect(idOut).toBe(cliStore.lastStrikeId);
});

afterAll(async () => {
  await cliStore.clear();
});
