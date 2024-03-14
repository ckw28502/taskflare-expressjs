const db = require("../db");
const UserModel = require("../../../models/UserModel");
const RegisterRequest = require("../../../dto/requests/auth/registerRequest");

const register = require("../../../services/auth/registerService");

describe("register service unit tests", () => {
  let request;

  beforeAll(async() => {
    await db.setUp();

    request = new RegisterRequest({
      email: "user@gmail.com",
      password: "user",
      confirmationPassword: "user"
    });
  });

  afterAll(async() => {
    await db.tearDown();
  });

  function mockUserExists(value) {
    jest.spyOn(UserModel, "exists").mockReturnValue(value);
  }
  it("should return 400 when email already registered!", async() => {
    mockUserExists(true);
    const response = await register(request);

    expect(response).toEqual({
      code: 400,
      message: "EMAIL_EXISTS"
    });
  });

  it("should return 400 when password and confirmation password are different!", async() => {
    mockUserExists(null);

    const currentRequest = new RegisterRequest({
      email: request.getEmail(),
      password: request.getPassword(),
      confirmationPassword: "useer"
    });

    const response = await register(currentRequest);

    expect(response).toEqual({
      code: 400,
      message: "PASSWORD_MISSMATCH"
    });
  });

  it("should create new user object", async() => {
    mockUserExists(null);

    const createUserSpy = jest.spyOn(UserModel, "create");

    await register(request);

    expect(createUserSpy).toHaveBeenCalled();
  });
});
