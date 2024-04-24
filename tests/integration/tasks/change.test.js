const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const changeTaskStatus = require("../../../services/tasks/changeTaskStatusService");
jest.mock("../../../services/tasks/changeTaskStatusService");

const UserModel = require("../../../models/UserModel");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const taskData = require("../../data/test-task.json");
const { generateToken } = require("../../../security/jwt");

const log = require("../../../services/logService");
const ProjectModel = require("../../../models/ProjectModel");
const TaskModel = require("../../../models/TaskModel");
jest.mock("../../../services/logService", () => jest.fn());
const taskEnum = require("../../../models/task-enum.json");

describe("Change task status integration tests", () => {
  let token;

  let user;
  let task;

  let requestBody;

  beforeAll(async() => {
    await db.setUp();
    user = await UserModel.create(userData.user);
    const project = await ProjectModel.create(projectData.project);
    task = await TaskModel.create({ project, ...taskData.task });
    requestBody = { id: task._id };

    token = generateToken(user._id);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .patch("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(value);
  }

  it("Should return 401 when token is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await getRequest();

    expect(response.status).toEqual(401);
  });

  const invalidRequestBodies = [
    {},
    {
      id: "1"
    },
    {
      id: "1",
      status: "status"
    }
  ];

  it.each(invalidRequestBodies)("Should return 400 if request is invalid", async(mockRequestBody) => {
    if (mockRequestBody.id) {
      mockRequestBody.id = task._id;
    }

    const response = await getRequest(mockRequestBody);

    expect(response.status).toEqual(400);
  });

  it.each(taskEnum)("Should return 204 if request is valid!", async(status) => {
    requestBody.status = status;

    changeTaskStatus.mockReturnValue({
      user,
      code: 204,
      message: "TASK_MODIFIED"
    });

    const response = await getRequest(requestBody);

    expect(response.status).toEqual(204);
    expect(log).toHaveBeenCalled();
  });
});
