const moment = require("moment");
const PositionModel = require("../../models/PositionModel");
const ProjectModel = require("../../models/ProjectModel");
const RoleModel = require("../../models/RoleModel");
const UserModel = require("../../models/UserModel");
const { decodeToken } = require("../../security/jwt");

async function isTitleAvailability(userId, title) {
  const positions = await PositionModel.find({ user: userId }).populate("project");

  const projectTitles = positions.map(position => position.project.title.toLowerCase());

  return projectTitles.includes(title.toLowerCase());
}

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

  if (await isTitleAvailability(payload.id, request.getTitle())) {
    return {
      code: 400,
      message: "PROJECT_TITLE_EXISTS"
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

  const role = await RoleModel.create({
    project: project._id,
    name: "OWNER"
  });

  await PositionModel.create({
    user: user._id,
    project: project._id,
    role: role._id
  });

  return {
    user,
    code: 201,
    message: "PROJECT_CREATED"
  };
}

module.exports = createProject;
