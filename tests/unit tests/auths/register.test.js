const db = require("../db");
const UserModel = require("../../../models/userModel");
const RegisterRequest = require("../../../dto/requests/auth/registerRequest");

const registerService = require("../../../services/auth/registerService");

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

describe("register service unit tests", () => {
  it("should return 400 when email already registered!", async() => {
    mockUserExists(true);
    const response = await registerService(request);

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

    const response = await registerService(currentRequest);

    expect(response).toEqual({
      code: 400,
      message: "PASSWORD_MISSMATCH"
    });
  });

  it("should create new user object", async() => {
    mockUserExists(null);

    const createUserSpy = jest.spyOn(UserModel, "create");

    await registerService(request);

    expect(createUserSpy).toHaveBeenCalled();
  });
});
