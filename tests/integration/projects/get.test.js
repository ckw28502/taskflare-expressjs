const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const getAllProjects = require("../../../services/projects/getAllProjectsService");
jest.mock("../../../services/projects/getAllProjectsService");

const UserModel = require("../../../models/userModel");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const { generateToken } = require("../../../security/jwt");

const ProjectModel = require("../../../models/projectModel");
const ProjectResponse = require("../../../dto/responses/projectResponse");

const log = require("../../../services/logService");
jest.mock("../../../services/logService", () => jest.fn());

describe("Get project integration tests", () => {
  let token;
  let user;
  let projects;

  beforeAll(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);

    token = generateToken(user._id);

    projects = await ProjectModel.insertMany(projectData.projects);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .get("/projects")
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
    const responses = projects.map(project => new ProjectResponse(project));

    getAllProjects.mockReturnValue({
      code: 200,
      message: "PROJECTS_RETRIEVED",
      responseBody: responses,
      user
    });

    const response = await getRequest();

    expect(log).toHaveBeenCalled();
    expect(response.status).toEqual(200);
  });
});
