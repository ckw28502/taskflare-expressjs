const PositionModel = require("../../models/PositionModel");
const ProjectModel = require("../../models/ProjectModel");
const UserModel = require("../../models/UserModel");
const { decodeToken } = require("../../security/jwt");

async function removePosition(request) {
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

  const position = await PositionModel.findOne({ user, project, isDeleted: null });
  if (!position) {
    return {
      user,
      code: 400,
      message: "USER_NOT_ASSIGNED"
    };
  }

  position.isDeleted = new Date();
  await position.save();

  return {
    user,
    code: 204,
    message: "USER_UNASSIGNED"
  };
}

module.exports = removePosition;
