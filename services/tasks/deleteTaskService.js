const PositionModel = require("../../models/positionModel");
const TaskModel = require("../../models/taskModel");
const UserModel = require("../../models/userModel");
const { decodeToken } = require("../../security/jwt");

async function deleteTask(request) {
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

  const position = await PositionModel.findOne({ user, project: task.project, isDeleted: null });
  if (!position) {
    return {
      user,
      code: 403,
      message: "FORBIDDEN_ACCESS"
    };
  }

  await TaskModel.deleteOne({ _id: task._id });
  return {
    user,
    code: 204,
    message: "TASK_DELETED"
  };
}

module.exports = deleteTask;
