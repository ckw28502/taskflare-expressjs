const PositionModel = require("../../models/positionModel");
const ProjectModel = require("../../models/projectModel");
const UserModel = require("../../models/userModel");
const { decodeToken } = require("../../security/jwt");
const moment = require("moment");

async function editProject(request) {
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

  const title = request.getTitle();
  if (title) {
    project.title = title;
  }

  const description = request.getDescription();
  if (description) {
    project.description = description;
  }

  const deadline = request.getDeadline();
  if (deadline) {
    if (!moment(deadline).isAfter(moment(), "day")) {
      return {
        user,
        code: 400,
        message: "DEADLINE_INVALID"
      };
    }
    project.deadline = deadline;
  }

  project.save();

  return {
    user,
    code: 204,
    message: "PROJECT_MODIFIED"
  };
}

module.exports = editProject;
