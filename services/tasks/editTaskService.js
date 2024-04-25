const TaskResponse = require("../../dto/responses/taskResponse");
const PositionModel = require("../../models/positionModel");
const TaskModel = require("../../models/taskModel");
const UserModel = require("../../models/userModel");
const { decodeToken } = require("../../security/jwt");
const moment = require("moment");

async function editTask(request) {
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

  const task = await TaskModel.findById(request.getId());
  if (!task) {
    return {
      user,
      code: 400,
      message: "TASK_NOT_FOUND"
    };
  }

  const position = await PositionModel.findOne({
    user,
    project: task.project,
    isDeleted: null
  });
  if (!position) {
    return {
      user,
      code: 403,
      message: "FORBIDDEN_ACCESS"
    };
  }

  if (request.getPositionId()) {
    const newPosition = await PositionModel.findById(request.getPositionId()).populate("user");
    if (!newPosition) {
      return {
        user,
        code: 400,
        message: "USER_UNASSIGNED"
      };
    }
    task.position = newPosition;
  }

  if (request.getDeadline() && !moment(request.getDeadline()).isAfter(moment(), "day")) {
    return {
      user,
      code: 400,
      message: "DEADLINE_INVALID"
    };
  }

  task.title = request.getTitle();
  task.description = request.getDescription();
  task.deadline = request.getDeadline();
  await task.save();

  return {
    user,
    code: 200,
    message: "TASK_MODIFIED",
    responseBody: new TaskResponse(task)
  };
}

module.exports = editTask;
