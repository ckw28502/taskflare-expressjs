const PositionModel = require("../../models/PositionModel");
const ProjectModel = require("../../models/ProjectModel");
const UserModel = require("../../models/UserModel");
const TaskModel = require("../../models/TaskModel");
const { decodeToken } = require("../../security/jwt");
const TaskResponse = require("../../dto/responses/taskResponse");

async function createTask(request) {
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
  let position;
  if (request.getPositionId()) {
    position = await PositionModel.findById(request.getPositionId()).populate("user");
    if (!position) {
      return {
        user,
        code: 400,
        message: "USER_UNASSIGNED"
      };
    }
  }

  const task = await TaskModel.create({
    project,
    position,
    title: request.getTitle(),
    description: request.getDescription(),
    deadline: request.getDeadline()
  });

  console.log(task);

  return {
    user,
    code: 201,
    message: "TASK_CREATED",
    responseBody: new TaskResponse(task)
  };
}

module.exports = createTask;
