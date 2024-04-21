const PositionModel = require("../../models/PositionModel");
const TaskModel = require("../../models/TaskModel");
const UserModel = require("../../models/UserModel");
const { decodeToken } = require("../../security/jwt");

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
    const newPosition = await PositionModel.findById(request.getPositionId());
    if (!newPosition) {
      return {
        user,
        code: 400,
        message: "USER_UNASSIGNED"
      };
    }
    task.position = newPosition;
  }

  task.title = request.getTitle();
  task.description = request.getDescription();
  task.deadline = request.getDeadline();
  task.save();

  return {
    user,
    code: 204,
    message: "TASK_MODIFIED"
  };
}

module.exports = editTask;
