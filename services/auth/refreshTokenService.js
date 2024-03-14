const UserModel = require("../../models/UserModel");
const { generateToken, decodeRefreshToken } = require("../../security/jwt");

async function refreshToken(token) {
  const decodedToken = decodeRefreshToken(token);
  if (!decodedToken) {
    return {
      code: 401,
      message: "REFRESH_TOKEN_INVALID"
    };
  }

  const user = await UserModel.findById(decodedToken.id);
  if (!user) {
    return {
      code: 401,
      message: "REFRESH_TOKEN_PAYLOAD_INVALID"
    };
  }

  return {
    code: 201,
    token: generateToken(user._id),
    message: "TOKEN_REFRESHED",
    user
  };
}

module.exports = refreshToken;
