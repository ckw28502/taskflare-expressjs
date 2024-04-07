const request = require("supertest");
const app = require("../../../app");

const login = require("../../../services/auth/loginService");
jest.mock("../../../services/auth/loginService");

const log = require("../../../services/logService");
const UserModel = require("../../../models/UserModel");
const userData = require("../../data/test-user.json");
const LoginResponse = require("../../../dto/responses/auths/loginResponse");
jest.mock("../../../services/logService", () => jest.fn());

describe("login integration tests", () => {
  const requestBody = userData.user;

  it("should return 403 if request has authorization token", async() => {
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
      email: requestBody.email
    }
  ];

  it.each(requestBodies)("should return 400 when request body schema is invalid!", async(mockRequestBody) => {
    const response = await request(app)
      .post("/login")
      .send(mockRequestBody);

    expect(response.status).toEqual(400);
  });

  it("should return 201 when request is valid", async() => {
    const expectedResponse = {
      code: 200,
      message: "LOGGED_IN",
      user: new UserModel(requestBody),
      responseBody: new LoginResponse(
        "token",
        "refreshToken"
      )
    };

    login.mockResolvedValue(expectedResponse);
    const actualResponse = await request(app)
      .post("/login")
      .send(requestBody);

    expect(actualResponse.status).toEqual(expectedResponse.code);
    expect(log).toHaveBeenCalled();
  });
});
