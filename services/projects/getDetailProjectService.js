const ProjectResponse = require("../../dto/responses/projectResponse");
const PositionModel = require("../../models/positionModel");
const ProjectModel = require("../../models/projectModel");
const UserModel = require("../../models/userModel");
const { decodeToken } = require("../../security/jwt");

async function getDetailProject(request) {
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

  const position = await PositionModel.findOne({ user, project: projectId, isDeleted: null });
  if (!position) {
    return {
      user,
      code: 403,
      message: "FORBIDDEN_ACCESS"
    };
  }

  const project = await ProjectModel.findById(request.getProjectId());

  return {
    code: 200,
    message: "PROJECT_RETRIEVED",
    responseBody: new ProjectResponse(project),
    user
  };
}

module.exports = getDetailProject;
