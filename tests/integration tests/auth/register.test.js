const request = require("supertest");
const app = require("../../../app");

const register = require("../../../services/auth/registerService");
jest.mock("../../../services/auth/registerService");

const log = require("../../../services/logService");
const UserModel = require("../../../models/UserModel");
jest.mock("../../../services/logService", () => jest.fn());

describe("register integration tests", () => {
  test("should return 403 if request has authorization token", async() => {
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
      email: "user@gmail.com"
    },
    {
      email: "user@gmail.com",
      password: "user"
    }
  ];

  test.each(requestBodies)("should return 400 when request body schema is invalid!", async(requestBody) => {
    const response = await request(app)
      .post("/register")
      .send(requestBody);

    expect(response.status).toEqual(400);
  });

  test("should return 201 when request is valid", async() => {
    const req = {
      email: "user@gmail.com",
      password: "user",
      confirmationPassword: "user"
    };
    const responseBody = {
      code: 201,
      message: "USER_CREATED",
      user: new UserModel({
        email: req.email,
        password: req.password
      })
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
