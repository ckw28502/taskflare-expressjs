const db = require("../db");
const UserModel = require("../../../models/UserModel");

const refreshToken = require("../../../services/auth/refreshTokenService");

const { decodeRefreshToken, generateToken } = require("../../../security/jwt");
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

    user = new UserModel({
      email: "user@gmail.com",
      password: "user"
    });
  });

  afterAll(async() => {
    await db.tearDown();
  });

  function mockFindById(value) {
    jest.spyOn(UserModel, "findById").mockReturnValue(value);
  }

  it("should return 401 if refresh token is invalid", async() => {
    decodeRefreshToken.mockReturnValue(null);

    const response = await refreshToken(token);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("REFRESH_TOKEN_INVALID");
  });

  it("should return 401 if refresh token payload is invalid", async() => {
    decodeRefreshToken.mockReturnValue({ id: 1 });
    mockFindById(null);

    const response = await refreshToken(token);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("REFRESH_TOKEN_PAYLOAD_INVALID");
  });

  it("should return 200 token refreshed", async() => {
    decodeRefreshToken.mockReturnValue({ id: 1 });
    mockFindById(user);

    const response = await refreshToken(token);

    expect(generateToken).toHaveBeenCalled();

    expect(response.code).toEqual(201);
    expect(response.message).toEqual("TOKEN_REFRESHED");
    expect(response.user).toEqual(user);
    expect(response).toHaveProperty("token");
  });
});
