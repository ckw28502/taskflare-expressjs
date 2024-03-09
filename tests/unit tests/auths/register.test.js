const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const UserModel = require("../../../models/userModel");
const RegisterRequest = require("../../../dto/requests/auth/registerRequest");

const registerService = require("../../../services/auth/registerService");

let mongoServer;
let request;

beforeAll(async() => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri);
  request = new RegisterRequest({
    email: "user@gmail.com",
    password: "user",
    confirmationPassword: "user"
  });
});

afterAll(async() => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

function mockUserExists(value) {
  jest.spyOn(UserModel, "exists").mockReturnValue(value);
}

describe("Register", () => {
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

    const saveUser = jest.spyOn(UserModel, "create");

    await registerService(request);

    expect(saveUser).toHaveBeenCalled();
  });
});
