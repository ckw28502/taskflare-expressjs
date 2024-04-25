const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const register = require("../../../services/auth/registerService");
jest.mock("../../../services/auth/registerService");

const log = require("../../../services/logService");
const UserModel = require("../../../models/userModel");
jest.mock("../../../services/logService", () => jest.fn());

const userData = require("../../data/test-user.json");

describe("register integration tests", () => {
  const requestBody = userData.user;

  beforeAll(async() => {
    await db.setUp();
  });

  afterAll(async() => {
    await db.tearDown();
  });

  it("should return 403 if request has authorization token", async() => {
    const response = await request(app)
      .post("/register")
      .set("Authorization", "Bearer jwt");

    expect(response.status).toEqual(403);
  });

  const requestBodies = [
    {},
    {
      email: "user"
    },
    {
      email: requestBody.email
    },
    {
      email: requestBody.email,
      name: requestBody.name
    },
    {
      email: requestBody.email,
      name: requestBody.name,
      password: requestBody.password
    },
    requestBody
  ];

  it.each(requestBodies)("should return 400 when request body schema is invalid!", async(requestBody) => {
    const response = await request(app)
      .post("/register")
      .send(requestBody);

    expect(response.status).toEqual(400);
  });

  it("should return 201 when request is valid", async() => {
    const req = {
      email: requestBody.email,
      name: requestBody.name,
      password: requestBody.password,
      confirmationPassword: requestBody.password
    };
    const responseBody = {
      code: 201,
      message: "USER_CREATED",
      user: await UserModel.create(userData.user)
    };

    register.mockResolvedValue(responseBody);
    const response = await request(app)
      .post("/register")
      .send(req);

    expect(response.status).toEqual(responseBody.code);
    expect(response.body).toEqual({ message: responseBody.message });
    expect(log).toHaveBeenCalled();
  });
});
