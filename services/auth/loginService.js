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
      message: "PASSWORD_INVALID",
      user
    };
  }

  return {
    code: 200,
    token: generateToken(user._id),
    refreshToken: generateRefreshToken(user._id),
    message: "LOGGED_IN",
    user
  };
}

module.exports = login;
