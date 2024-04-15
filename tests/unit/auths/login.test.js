const db = require("../db");
const UserModel = require("../../../models/UserModel");

const userData = require("../../data/test-user.json");

const LoginRequest = require("../../../dto/requests/auth/loginRequest");

const login = require("../../../services/auth/loginService");

const { match } = require("../../../security/bcyrpt");
const LoginResponse = require("../../../dto/responses/auths/loginResponse");
jest.mock("../../../security/bcyrpt", () => {
  return {
    match: jest.fn()
  };
});

describe("login unit tests", () => {
  let request;
  let user;

  beforeAll(async() => {
    await db.setUp();

    request = new LoginRequest(userData.user);

    user = UserModel.create(userData.user);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  it("should return 400 if email not found", async() => {
    jest.spyOn(UserModel, "findOne").mockReturnValueOnce(false);

    const response = await login(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("EMAIL_NOT_FOUND");
  });

  it("should return 400 if password is invalid", async() => {
    match.mockResolvedValue(false);

    const response = await login(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("PASSWORD_INVALID");
  });

  it("should return 200 if logged in", async() => {
    match.mockResolvedValue(true);

    const response = await login(request);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("LOGGED_IN");
    expect(response.responseBody).toBeInstanceOf(LoginResponse);
  });
});
