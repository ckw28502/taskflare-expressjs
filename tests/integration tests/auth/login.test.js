const request = require("supertest");
const app = require("../../../app");

const login = require("../../../services/auth/loginService");
jest.mock("../../../services/auth/loginService");

const log = require("../../../services/logService");
const UserModel = require("../../../models/userModel");
jest.mock("../../../services/logService", () => jest.fn());

describe("login integration tests", () => {
  test("should return 403 if request has authorization token", async() => {
    const response = await request(app)
      .post("/login")
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
    }
  ];

  test.each(requestBodies)("should return 400 when request body schema is invalid!", async(requestBody) => {
    const response = await request(app)
      .post("/login")
      .send(requestBody);

    expect(response.status).toEqual(400);
  });

  test("should return 201 when request is valid", async() => {
    const req = {
      email: "user@gmail.com",
      password: "user"
    };

    const responseBody = {
      code: 200,
      message: "LOGGED_IN",
      user: new UserModel(req),
      token: "token",
      refreshToken: "refresh token"
    };

    login.mockResolvedValue(responseBody);
    const response = await request(app)
      .post("/login")
      .send({
        email: "user@gmail.com",
        password: "user"
      });

    expect(response.status).toEqual(responseBody.code);
    expect(response.body).toEqual({
      token: responseBody.token,
      refreshToken: responseBody.refreshToken
    });
    expect(log).toHaveBeenCalled();
  });
});
