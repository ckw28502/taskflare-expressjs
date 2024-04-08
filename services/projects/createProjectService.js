const moment = require("moment");
const PositionModel = require("../../models/PositionModel");
const ProjectModel = require("../../models/ProjectModel");
const UserModel = require("../../models/UserModel");
const { decodeToken } = require("../../security/jwt");

async function createProject(request) {
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

  if (request.getDeadline() && !moment(request.getDeadline()).isAfter(moment(), "day")) {
    return {
      code: 400,
      message: "PROJECT_DEADLINE_INVALID"
    };
  }

  const project = await ProjectModel.create({
    title: request.getTitle(),
    description: request.getDescription(),
    deadline: request.getDeadline()
  });

  await PositionModel.create({
    user: user._id,
    project: project._id
  });

  return {
    user,
    code: 201,
    message: "PROJECT_CREATED",
    responseBody: project._id
  };
}

module.exports = createProject;
