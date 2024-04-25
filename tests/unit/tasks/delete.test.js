const UserModel = require("../../../models/userModel");
const ProjectModel = require("../../../models/projectModel");
const PositionModel = require("../../../models/positionModel");
const db = require("../db");
const projectData = require("../../data/test-project.json");
const taskData = require("../../data/test-task.json");

const deleteTask = require("../../../services/tasks/deleteTaskService");

const { decodeToken } = require("../../../security/jwt");
jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});

const userData = require("../../data/test-user.json");
const TaskModel = require("../../../models/taskModel");
const DeleteTaskRequest = require("../../../dto/requests/tasks/deleteTaskRequest");

describe("Delete task unit tests", () => {
  let request;

  let user;

  beforeEach(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);
    const project = await ProjectModel.create(projectData.project);
    await PositionModel.create({ user, project });
    const task = await TaskModel.create({ project, ...taskData.task });

    request = new DeleteTaskRequest("token", task._id);

    decodeToken.mockReturnValue(user._id);
  });

  afterEach(async() => {
    await db.tearDown();
  });

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValueOnce(undefined);
    const response = await deleteTask(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  it("Should return 401 if token payload is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await deleteTask(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  it("Should return 400 if task is not found", async() => {
    jest.spyOn(TaskModel, "findById").mockReturnValueOnce(undefined);

    const response = await deleteTask(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("TASK_NOT_FOUND");
  });

  it("Should return 403 if user is unauthorized", async() => {
    jest.spyOn(PositionModel, "findOne").mockReturnValueOnce(undefined);

    const response = await deleteTask(request);

    expect(response.code).toEqual(403);
    expect(response.message).toEqual("FORBIDDEN_ACCESS");
  });

  it("Should delete task", async() => {
    const deleteTaskSpy = jest.spyOn(TaskModel, "deleteOne");
    const response = await deleteTask(request);

    expect(deleteTaskSpy).toHaveBeenCalled();

    expect(response.code).toEqual(204);
    expect(response.message).toEqual("TASK_DELETED");

    expect(await TaskModel.findById(request.getId())).toBeNull();
  });
});
