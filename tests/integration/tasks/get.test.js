const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const getAllTasks = require("../../../services/tasks/getAllTasksService");
jest.mock("../../../services/tasks/getAllTasksService");

const UserModel = require("../../../models/userModel");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const taskData = require("../../data/test-task.json");
const { generateToken } = require("../../../security/jwt");

const ProjectModel = require("../../../models/projectModel");

const log = require("../../../services/logService");
const TaskModel = require("../../../models/taskModel");
const TaskResponse = require("../../../dto/responses/taskResponse");
jest.mock("../../../services/logService", () => jest.fn());

describe("Get project integration tests", () => {
  let token;
  let user;
  let project;
  let tasks;

  beforeAll(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);

    token = generateToken(user._id);

    project = await ProjectModel.create(projectData.project);

    tasks = [];
    for (const task of taskData.tasks) {
      tasks.push(await TaskModel.create({ project, ...task }));
    }
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .get(`/tasks/${project._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(value);
  }

  it("Should return 401 when token is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await getRequest();

    expect(response.status).toEqual(401);
  });

  it("Should return 400 if body is not empty", async() => {
    const response = await getRequest({ token });

    expect(response.status).toEqual(400);
  });

  it("Should return 200 when request is valid", async() => {
    const responses = tasks.map(task => new TaskResponse(task));

    getAllTasks.mockReturnValue({
      code: 200,
      message: "TASKS_RETRIEVED",
      responseBody: responses,
      user
    });

    const response = await getRequest();

    expect(log).toHaveBeenCalled();
    expect(response.status).toEqual(200);
  });
});
