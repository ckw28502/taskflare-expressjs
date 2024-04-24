const LogModel = require("../../models/logModel");

const log = require("../../services/logService");

const db = require("./db");

beforeAll(async() => {
  await db.setUp();
});

afterAll(async() => {
  await db.tearDown();
});

describe("Log service unit tests", () => {
  it("should create a new log", async() => {
    const createLogSpy = jest.spyOn(LogModel, "create");

    await log(
      null,
      "TEST",
      0,
      "TEST_SUCCEED",
      "LOG"
    );

    expect(createLogSpy).toHaveBeenCalled();
  });
});
