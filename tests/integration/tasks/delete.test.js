const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const deleteTask = require("../../../services/tasks/deleteTaskService");
jest.mock("../../../services/tasks/deleteTaskService");

const UserModel = require("../../../models/UserModel");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const taskData = require("../../data/test-task.json");
const { generateToken } = require("../../../security/jwt");

const ProjectModel = require("../../../models/ProjectModel");

const log = require("../../../services/logService");
const TaskModel = require("../../../models/TaskModel");
const TaskResponse = require("../../../dto/responses/taskResponse");
jest.mock("../../../services/logService", () => jest.fn());

describe("Get project integration tests", () => {
  let token;
  let user;
  let project;
  let task;

  beforeAll(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);

    token = generateToken(user._id);

    project = await ProjectModel.create(projectData.project);

    task = await TaskModel.create({ project, ...taskData.task });
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .delete(`/tasks/${task._id}`)
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

  it("Should return 204 when request is valid", async() => {
    const responseBody = new TaskResponse(task);

    deleteTask.mockReturnValue({
      code: 204,
      message: "TASK_DELETED",
      responseBody,
      user
    });

    const response = await getRequest();

    expect(log).toHaveBeenCalled();
    expect(response.status).toEqual(204);
  });
});
