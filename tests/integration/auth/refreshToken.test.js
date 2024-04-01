const request = require("supertest");
const app = require("../../../app");

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
    user = new UserModel(userData.user);

    token = generateRefreshToken(user);
  });

  async function getRequest(value) {
    return request(app)
      .post("/refresh")
      .set("Authorization", `Bearer ${token}`)
      .send(value);
  }

  function mockUserFindById(value) {
    jest.spyOn(UserModel, "findById").mockResolvedValue(value);
  }

  it("should return 401 if refresh token invalid", async() => {
    mockUserFindById(null);

    const response = await getRequest();

    expect(response.status).toEqual(401);
  });

  it("should return 400 if body is not empty", async() => {
    mockUserFindById(user);

    const response = await getRequest({ token });

    expect(response.status).toEqual(400);
  });

  it("should return 201 when request is valid", async() => {
    mockUserFindById(user);
    const responseBody = new RefreshTokenResponse("token");

    const response = await getRequest(responseBody);

    expect(log).toHaveBeenCalled();

    expect(response.status).toEqual(201);
    expect(response.body).toEqual(responseBody);
  });
});
