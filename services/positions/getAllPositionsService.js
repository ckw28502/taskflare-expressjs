const PositionResponse = require("../../dto/responses/positionResponse");
const PositionModel = require("../../models/PositionModel");
const ProjectModel = require("../../models/ProjectModel");
const UserModel = require("../../models/UserModel");
const { decodeToken } = require("../../security/jwt");

async function getAllPositions(request) {
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
      code: 403,
      message: "FORBIDDEN_ACCESS"
    };
  }

  const positions = await PositionModel.find({ project, isDeleted: null }).populate("user");
  const responseBody = positions.map(position => new PositionResponse(position._id, position.user.email));

  return {
    user,
    code: 200,
    message: "POSITIONS_RETRIEVED",
    responseBody
  };
}

module.exports = getAllPositions;
