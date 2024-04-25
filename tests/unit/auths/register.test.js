const db = require("../db");
const UserModel = require("../../../models/userModel");
const userData = require("../../data/test-user.json");

const RegisterRequest = require("../../../dto/requests/auth/registerRequest");

const register = require("../../../services/auth/registerService");

describe("register service unit tests", () => {
  let request;

  beforeAll(async() => {
    await db.setUp();
    const testUser = userData.user;

    request = new RegisterRequest({
      email: testUser.email,
      name: testUser.name,
      password: testUser.password,
      confirmationPassword: testUser.password
    });
  });

  afterAll(async() => {
    await db.tearDown();
  });

  it("should return 400 when email already registered!", async() => {
    jest.spyOn(UserModel, "exists").mockReturnValueOnce(true);
    const response = await register(request);

    expect(response).toEqual({
      code: 400,
      message: "EMAIL_EXISTS"
    });
  });

  it("should return 400 when password and confirmation password are different!", async() => {
    const currentRequest = new RegisterRequest({
      email: request.getEmail(),
      name: request.getName(),
      password: request.getPassword(),
      confirmationPassword: request.getPassword() + " "
    });

    const response = await register(currentRequest);

    expect(response).toEqual({
      code: 400,
      message: "PASSWORD_MISSMATCH"
    });
  });

  it("should create new user object", async() => {
    const createUserSpy = jest.spyOn(UserModel, "create");

    await register(request);

    expect(createUserSpy).toHaveBeenCalled();
  });
});
