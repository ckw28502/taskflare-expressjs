const UserModel = require("../../../models/userModel");
const db = require("../db");
const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const ProjectModel = require("../../../models/projectModel");
const getAllProjects = require("../../../services/projects/getAllProjectsService");

const { decodeToken } = require("../../../security/jwt");
const PositionModel = require("../../../models/positionModel");

const ProjectResponse = require("../../../dto/responses/projectResponse");
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

    decodeToken.mockReturnValue(user._id);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValueOnce(null);

    const response = await getAllProjects(token);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  it("Should return 401 if token payload is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(false);

    const response = await getAllProjects(token);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  it("Should get all user's projects", async() => {
    const expectedResponses = projects.map(project => new ProjectResponse(project));

    const response = await getAllProjects(token);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("PROJECTS_RETRIEVED");
    expect(response.responseBody).toEqual(expectedResponses);
  });
});
