const PositionModel = require("../../models/PositionModel");
const ProjectModel = require("../../models/ProjectModel");
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

  const project = await ProjectModel.findById(request.getProjectId());
  if (!project) {
    return {
      user,
      code: 400,
      message: "PROJECT_NOT_FOUND"
    };
  }

  if (!await PositionModel.findOne({ user, project, isDeleted: null })) {
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

  if (await PositionModel.findOne({ user: newUser, project, isDeleted: null })) {
    return {
      user,
      code: 400,
      message: "USER_ALREADY_ASSIGNED"
    };
  }

  await PositionModel.create({ user: newUser, project });

  return {
    user,
    message: "USER_ASSIGNED",
    code: 201
  };
}

module.exports = addPosition;
