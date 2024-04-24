const LoginResponse = require("../../dto/responses/auths/loginResponse");
const UserModel = require("../../models/UserModel");
const { match } = require("../../security/bcyrpt");
const { generateToken, generateRefreshToken } = require("../../security/jwt");

async function login(request) {
  const user = await UserModel.findOne({ email: request.getEmail() });
  if (!user) {
    return {
      code: 400,
      message: "EMAIL_NOT_FOUND"
    };
  }
  if (!await match(request.getPassword(), user.password)) {
    return {
      code: 400,
      message: "PASSWORD_INVALID"
    };
  }

  const responseBody = new LoginResponse(
    generateToken(user._id),
    generateRefreshToken(user._id)
  );

  return {
    code: 200,
    message: "LOGGED_IN",
    responseBody,
    user
  };
}

module.exports = login;
