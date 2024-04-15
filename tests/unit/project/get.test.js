const UserModel = require("../../../models/UserModel");
const db = require("../db");
const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const ProjectModel = require("../../../models/ProjectModel");
const getAllProjects = require("../../../services/projects/getAllProjectsService");

const { decodeToken } = require("../../../security/jwt");
const PositionModel = require("../../../models/PositionModel");

const ProjectResponse = require("../../../dto/responses/projects/projectResponse");
jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});

describe("get projects unit tests", () => {
  let user;
  let token;
  let projects;
  const positions = [];

  beforeAll(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);

    token = "token";

    projects = await ProjectModel.insertMany(projectData.projects);

    for (const project of projects) {
      const position = await PositionModel.create({
        user: user._id,
        project
      });
      positions.push(position);
    }
  });

  afterAll(async() => {
    await db.tearDown();
  });

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValue(null);

    const response = await getAllProjects(token);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  function mockUserFindById(value) {
    jest.spyOn(UserModel, "findById").mockReturnValue(value);
  }

  it("Should return 401 if token payload is invalid", async() => {
    decodeToken.mockReturnValue(user._id);
    mockUserFindById(null);

    const response = await getAllProjects(token);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  it("Should get all user's projects", async() => {
    decodeToken.mockReturnValue(user._id);
    mockUserFindById(user);

    const expectedResponses = projects.map(project => new ProjectResponse(project));

    const response = await getAllProjects(token);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("PROJECTS_RETRIEVED");
    expect(response.responseBody).toEqual(expectedResponses);
    expect(response.user).toEqual(user);
  });
});
