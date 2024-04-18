const ProjectModel = require("../../models/ProjectModel");
const UserModel = require("../../models/UserModel");
const { decodeToken } = require("../../security/jwt");

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
      code: 400,
      message: "PROJECT_NOT_FOUND"
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
