const db = require("../db");
const UserModel = require("../../../models/UserModel");

const LoginRequest = require("../../../dto/requests/auth/loginRequest");

const login = require("../../../services/auth/loginService");

const { match } = require("../../../security/bcyrpt");
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

    request = new LoginRequest({
      email: "user@gmail.com",
      password: "user"
    });

    user = new UserModel({
      email: request.getEmail(),
      password: request.getPassword()
    });
  });

  afterAll(async() => {
    await db.tearDown();
  });

  function mockFindByEmail(value) {
    jest.spyOn(UserModel, "findOne").mockReturnValue(value);
  }

  it("should return 400 if email not found", async() => {
    mockFindByEmail(false);

    const response = await login(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("EMAIL_NOT_FOUND");
  });

  it("should return 400 if password is invalid", async() => {
    mockFindByEmail(user);
    match.mockResolvedValue(false);

    const response = await login(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("PASSWORD_INVALID");
  });

  it("should return 200 if logged in", async() => {
    mockFindByEmail(user);
    match.mockResolvedValue(true);

    const response = await login(request);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("LOGGED_IN");
    expect(response).toHaveProperty("code");
    expect(response).toHaveProperty("refreshToken");
  });
});
