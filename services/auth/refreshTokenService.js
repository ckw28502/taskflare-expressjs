const RefreshTokenResponse = require("../../dto/responses/auths/refreshTokenResponse");
const UserModel = require("../../models/UserModel");
const { generateToken, decodeRefreshToken } = require("../../security/jwt");

async function refreshToken(token) {
  const payload = decodeRefreshToken(token);
  if (!payload) {
    return {
      code: 401,
      message: "REFRESH_TOKEN_INVALID"
    };
  }

  const user = await UserModel.findById(payload.id);
  if (!user) {
    return {
      code: 401,
      message: "REFRESH_TOKEN_PAYLOAD_INVALID"
    };
  }

  const responseBody = new RefreshTokenResponse(generateToken(user._id));

  return {
    code: 201,
    message: "TOKEN_REFRESHED",
    responseBody,
    user
  };
}

module.exports = refreshToken;
