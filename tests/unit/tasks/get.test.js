const UserModel = require("../../../models/UserModel");
const ProjectModel = require("../../../models/ProjectModel");
const PositionModel = require("../../../models/PositionModel");
const db = require("../db");
const projectData = require("../../data/test-project.json");
const taskData = require("../../data/test-task.json");

const getAllTasks = require("../../../services/tasks/getAllTasksService");

const { decodeToken } = require("../../../security/jwt");
jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});

const userData = require("../../data/test-user.json");
const GetAllTasksRequest = require("../../../dto/requests/tasks/getAllTasksRequest");
const TaskModel = require("../../../models/TaskModel");
const TaskResponse = require("../../../dto/responses/taskResponse");

describe("Get tasks unit tests", () => {
  let request;

  let user;

  let tasks;
  beforeEach(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);
    const project = await ProjectModel.create(projectData.project);
    await PositionModel.create({ user, project });
    tasks = [];
    for (const task of taskData.tasks) {
      const newTask = await TaskModel.create({ project, ...task });
      tasks.push(newTask);
    }

    request = new GetAllTasksRequest("token", project._id);

    decodeToken.mockReturnValue(user._id);
  });

  afterEach(async() => {
    await db.tearDown();
  });

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValueOnce(undefined);
    const response = await getAllTasks(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  it("Should return 401 if token payload is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await getAllTasks(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  it("Should return 400 if project is not found", async() => {
    jest.spyOn(ProjectModel, "findById").mockReturnValueOnce(undefined);

    const response = await getAllTasks(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("PROJECT_NOT_FOUND");
  });

  it("Should return 403 if user is unauthorized", async() => {
    jest.spyOn(PositionModel, "findOne").mockReturnValueOnce(undefined);

    const response = await getAllTasks(request);

    expect(response.code).toEqual(403);
    expect(response.message).toEqual("FORBIDDEN_ACCESS");
  });

  it("Should get tasks", async() => {
    const responseBody = tasks.map(task => new TaskResponse(task));

    const response = await getAllTasks(request);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("TASKS_RETRIEVED");
    expect(response.responseBody).toEqual(responseBody);
  });
});
