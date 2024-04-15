const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const refreshToken = require("../../../services/auth/refreshTokenService");
jest.mock("../../../services/auth/refreshTokenService");

const UserModel = require("../../../models/UserModel");
const userData = require("../../data/test-user.json");
const { generateRefreshToken } = require("../../../security/jwt");
const log = require("../../../services/logService");
const RefreshTokenResponse = require("../../../dto/responses/auths/refreshTokenResponse");
jest.mock("../../../services/logService", () => jest.fn());

describe("refresh token integration test", () => {
  let user;
  let token;

  beforeAll(async() => {
    await db.setUp();
    user = await UserModel.create(userData.user);

    token = generateRefreshToken(user._id);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .post("/refresh")
      .set("Authorization", `Bearer ${token}`)
      .send(value);
  }

  it("should return 401 if refresh token invalid", async() => {
    jest.spyOn(UserModel, "findById").mockResolvedValueOnce(undefined);

    const response = await getRequest();

    expect(response.status).toEqual(401);
  });

  it("should return 400 if body is not empty", async() => {
    const response = await getRequest({ token });

    expect(response.status).toEqual(400);
  });

  it("should return 201 when request is valid", async() => {
    const expectedResponse = {
      code: 201,
      message: "TOKEN_REFRESHED",
      responseBody: new RefreshTokenResponse("token"),
      user
    };

    refreshToken.mockResolvedValue(expectedResponse);
    const actualResponse = await getRequest();

    expect(log).toHaveBeenCalled();

    expect(actualResponse.status).toEqual(201);
  });
});
