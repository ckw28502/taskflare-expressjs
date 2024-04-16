const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");
const UserModel = require("../../../models/UserModel");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const { generateToken } = require("../../../security/jwt");
const ProjectModel = require("../../../models/ProjectModel");
const ProjectResponse = require("../../../dto/responses/projects/projectResponse");
const getDetailProject = require("../../../services/projects/getDetailProjectService");
jest.mock("../../../services/projects/getDetailProjectService");
const log = require("../../../services/logService");
jest.mock("../../../services/logService");

describe("get project integration test", () => {
  let token;
  let user;
  let project;

  beforeAll(async() => {
    await db.setUp();
    user = await UserModel.create(userData.user);

    token = generateToken(user._id);

    project = await ProjectModel.create(projectData.project);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .get(`/projects/${project._id}`)
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
    getDetailProject.mockReturnValue({
      code: 200,
      message: "PROJECTS_RETRIEVED",
      responseBody: new ProjectResponse(project),
      user
    });

    const response = await getRequest();

    expect(log).toHaveBeenCalled();
    expect(response.status).toEqual(200);
  });
});
