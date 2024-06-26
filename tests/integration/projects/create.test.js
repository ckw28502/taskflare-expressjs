const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const createProject = require("../../../services/projects/createProjectService");
jest.mock("../../../services/projects/createProjectService");

const UserModel = require("../../../models/userModel");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const { generateToken } = require("../../../security/jwt");

const moment = require("moment");

const log = require("../../../services/logService");
const ProjectModel = require("../../../models/projectModel");
jest.mock("../../../services/logService", () => jest.fn());

describe("Create project integration tests", () => {
  let token;

  let user;

  const requestBody = projectData.project;

  beforeAll(async() => {
    await db.setUp();
    user = await UserModel.create(userData.user);

    token = generateToken(user._id);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .post("/projects")
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
    const response = await getRequest(mockRequestBody);

    expect(response.status).toEqual(400);
  });

  const requestBodies = [
    requestBody,
    {
      deadline: new Date(),
      ...requestBody
    }
  ];

  it.each(requestBodies)("Should return 201 if request is valid!", async(mockRequestBody) => {
    const project = new ProjectModel(mockRequestBody);
    createProject.mockReturnValue({
      user,
      code: 201,
      message: "PROJECT_CREATED",
      responseBody: project._id
    });

    const response = await getRequest(mockRequestBody);

    expect(log).toHaveBeenCalled();
    expect(response.status).toEqual(201);
  });
});
