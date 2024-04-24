const db = require("../db");
const UserModel = require("../../../models/UserModel");
const userData = require("../../data/test-user.json");

const refreshToken = require("../../../services/auth/refreshTokenService");

const { decodeRefreshToken, generateToken } = require("../../../security/jwt");
const RefreshTokenResponse = require("../../../dto/responses/auths/refreshTokenResponse");
jest.mock("../../../security/jwt", () => {
  return {
    decodeRefreshToken: jest.fn(),
    generateToken: jest.fn()
  };
});

describe("refresh token unit tests", () => {
  let token;

  let user;

  beforeAll(async() => {
    await db.setUp();

    token = "refresh token";

    user = await UserModel.create(userData.user);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  it("should return 401 if refresh token is invalid", async() => {
    const response = await refreshToken(token);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("REFRESH_TOKEN_INVALID");
  });

  it("should return 401 if refresh token payload is invalid", async() => {
    decodeRefreshToken.mockReturnValueOnce({ id: user.id });
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await refreshToken(token);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("REFRESH_TOKEN_PAYLOAD_INVALID");
  });

  it("should return 200 token refreshed", async() => {
    decodeRefreshToken.mockReturnValue({ id: user.id });

    const response = await refreshToken(token);

    expect(generateToken).toHaveBeenCalled();

    expect(response.code).toEqual(201);
    expect(response.message).toEqual("TOKEN_REFRESHED");
    expect(response.responseBody).toBeInstanceOf(RefreshTokenResponse);
  });
});
