const ProjectResponse = require("../../dto/responses/projectResponse");
const PositionModel = require("../../models/positionModel");
const UserModel = require("../../models/userModel");
const { decodeToken } = require("../../security/jwt");

async function getAllProjects(token) {
  const payload = decodeToken(token);
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

  const positions = await PositionModel.find({ user: user._id, isDeleted: null }).populate("project");

  const responses = positions.map(position => new ProjectResponse(position.project));

  return {
    code: 200,
    message: "PROJECTS_RETRIEVED",
    responseBody: responses,
    user
  };
}

module.exports = getAllProjects;
