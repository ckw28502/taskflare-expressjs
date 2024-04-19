const PositionModel = require("../../models/PositionModel");
const UserModel = require("../../models/UserModel");
const { decodeToken } = require("../../security/jwt");

async function addPosition(request) {
  const payload = decodeToken(request.getToken());
  if (!payload) {
    return {
      code: 401,
      message: "TOKEN_INVALID"
    };
  }

  const user = await UserModel.findById(payload.id);
  if (!user) {
    return {
      code: 401,
      message: "TOKEN_PAYLOAD_INVALID"
    };
  }

  const projectId = request.getProjectId();
  if (!await PositionModel.findOne({ user, project: projectId })) {
    return {
      user,
      code: 403,
      message: "FORBIDDEN_ACCESS"
    };
  }

  const newUser = await UserModel.findOne({ email: request.getEmail() });
  if (!newUser) {
    return {
      user,
      code: 400,
      message: "USER_NOT_FOUND"
    };
  }

  if (await PositionModel.findOne({ user: newUser, project: request.getProjectId() })) {
    return {
      user,
      code: 400,
      message: "USER_ALREADY_ASSIGNED"
    };
  }

  await PositionModel.create({ user: newUser, project: projectId });

  return {
    user,
    message: "USER_ASSIGNED",
    code: 201
  };
}

module.exports = addPosition;
