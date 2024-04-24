const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const editTask = require("../../../services/tasks/editTaskService");
jest.mock("../../../services/tasks/editTaskService");

const UserModel = require("../../../models/UserModel");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const taskData = require("../../data/test-task.json");
const { generateToken } = require("../../../security/jwt");

const moment = require("moment");

const log = require("../../../services/logService");
const ProjectModel = require("../../../models/ProjectModel");
const PositionModel = require("../../../models/PositionModel");
const TaskModel = require("../../../models/TaskModel");
const TaskResponse = require("../../../dto/responses/taskResponse");
jest.mock("../../../services/logService", () => jest.fn());

describe("Edit task integration tests", () => {
  let token;

  let user;
  let position;
  let task;

  const requestBody = taskData.task;

  beforeAll(async() => {
    await db.setUp();
    user = await UserModel.create(userData.user);
    const project = await ProjectModel.create(projectData.project);
    position = await PositionModel.create({ user, project });
    task = await TaskModel.create({ project, ...taskData.task });

    token = generateToken(user._id);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .put("/tasks")
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
      title: requestBody.title
    },
    {
      deadline: moment(new Date()).format("DD/MM/YYYY"),
      ...requestBody
    }
  ];

  it.each(invalidRequestBodies)("Should return 400 if request is invalid", async(mockRequestBody) => {
    mockRequestBody.id = task._id;
    const response = await getRequest(mockRequestBody);

    expect(response.status).toEqual(400);
  });

  const requestBodies = [
    requestBody,
    {
      deadline: new Date(),
      ...requestBody
    },
    {
      positionId: "1",
      ...requestBody
    },
    {
      positionId: "1",
      deadline: new Date(),
      ...requestBody
    }
  ];

  it.each(requestBodies)("Should return 200 if request is valid!", async(mockRequestBody) => {
    mockRequestBody.id = task._id;
    if (mockRequestBody.positionId) {
      mockRequestBody.positionId = position._id;
    }

    editTask.mockReturnValue({
      user,
      code: 200,
      message: "TASK_MODIFIED",
      responseBody: new TaskResponse(task)
    });

    const response = await getRequest(mockRequestBody);

    expect(response.status).toEqual(200);
    expect(log).toHaveBeenCalled();
  });
});
