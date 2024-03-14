const UserModel = require("../../models/UserModel");
const { generateToken, decodeToken } = require("../../security/jwt");

async function refreshToken(token) {
  const userId = decodeToken(token).id;

  const user = await UserModel.findById(userId);
  if (!user) {
    return {
      code: 401,
      message: "TOKEN_INVALID"
    };
  }
  return {
    code: 201,
    token: generateToken(userId),
    message: "TOKEN_REFRESHED",
    user
  };
}

module.exports = refreshToken;
