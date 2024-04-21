const TaskResponse = require("../../dto/responses/taskResponse");
const PositionModel = require("../../models/PositionModel");
const ProjectModel = require("../../models/ProjectModel");
const TaskModel = require("../../models/TaskModel");
const UserModel = require("../../models/UserModel");
const { decodeToken } = require("../../security/jwt");

async function getAllTasks(request) {
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

  const tasks = await TaskModel.find({ project }).populate({
    path: "position",
    populate: {
      path: "user"
    }
  });

  const responseBody = tasks.map(task => new TaskResponse(task));

  return {
    user,
    code: 200,
    message: "TASKS_RETRIEVED",
    responseBody
  };
}

module.exports = getAllTasks;
