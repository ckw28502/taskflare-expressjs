const UserModel = require("../../../models/UserModel");
const ProjectModel = require("../../../models/ProjectModel");
const PositionModel = require("../../../models/PositionModel");
const db = require("../db");
const projectData = require("../../data/test-project.json");
const taskData = require("../../data/test-task.json");

const editTask = require("../../../services/tasks/editTaskService");

const { decodeToken } = require("../../../security/jwt");
jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});

const userData = require("../../data/test-user.json");
const moment = require("moment");
const EditTaskRequest = require("../../../dto/requests/tasks/editTaskRequest");
const TaskModel = require("../../../models/TaskModel");

describe("Edit task unit tests", () => {
  let request;

  let user;

  let position;

  let today;
  beforeEach(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);
    const project = await ProjectModel.create(projectData.project);
    position = await PositionModel.create({ user, project });
    const task = await TaskModel.create({ project, ...taskData.task });

    request = new EditTaskRequest({
      token: "token",
      id: task._id,
      ...taskData.task
    });
    today = new Date();

    decodeToken.mockReturnValue(user._id);
  });

  afterEach(async() => {
    await db.tearDown();
  });

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValueOnce(undefined);
    const response = await editTask(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  it("Should return 401 if token payload is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await editTask(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  it("Should return 400 if task is not found", async() => {
    jest.spyOn(TaskModel, "findById").mockReturnValueOnce(undefined);

    const response = await editTask(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("TASK_NOT_FOUND");
  });

  it("Should return 403 if user is unauthorized", async() => {
    jest.spyOn(PositionModel, "findOne").mockReturnValueOnce(undefined);

    const response = await editTask(request);

    expect(response.code).toEqual(403);
    expect(response.message).toEqual("FORBIDDEN_ACCESS");
  });

  it("Should edit task without new assignee", async() => {
    const response = await editTask(request);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("TASK_MODIFIED");
  });

  it("Should return 400 if assigned user is not assigned to the project", async() => {
    request.setPositionId(user._id);

    const response = await editTask(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("USER_UNASSIGNED");
  });

  it("Should edit task with an assignee", async() => {
    request.setPositionId(position._id);

    const response = await editTask(request);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("TASK_MODIFIED");
  });

  it("Should return 400 if deadline is invalid", async() => {
    const yesterday = today.setDate(today.getDate() - 1);
    request.setDeadline(moment(yesterday).format("YYYY-MM-DD"));

    const response = await editTask(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("DEADLINE_INVALID");
  });

  it("Should edit task with a deadline", async() => {
    const tomorrow = today.setDate(today.getDate() + 1);
    request.setDeadline(moment(tomorrow).format("YYYY-MM-DD"));

    const response = await editTask(request);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("TASK_MODIFIED");
  });

  it("Should edit task with assignee and deadline", async() => {
    request.setPositionId(position._id);

    const tomorrow = today.setDate(today.getDate() + 1);
    request.setDeadline(moment(tomorrow).format("YYYY-MM-DD"));

    const response = await editTask(request);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("TASK_MODIFIED");
  });
});
