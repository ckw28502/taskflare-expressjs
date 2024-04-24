const UserModel = require("../../../models/UserModel");
const db = require("../db");
const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const ProjectModel = require("../../../models/ProjectModel");
const getDetailProject = require("../../../services/projects/getDetailProjectService");

const { decodeToken } = require("../../../security/jwt");
const PositionModel = require("../../../models/PositionModel");

const ProjectResponse = require("../../../dto/responses/projectResponse");
const GetProjectDetailRequest = require("../../../dto/requests/projects/getProjectDetail");
jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});

describe("get project unit tests", () => {
  let user;
  let token;
  let project;
  let request;

  beforeAll(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);

    token = "token";

    project = await ProjectModel.create(projectData.project);

    await PositionModel.create({ user, project });

    request = new GetProjectDetailRequest(token, project._id);

    decodeToken.mockReturnValue(user);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValueOnce(null);

    const response = await getDetailProject(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  it("Should return 401 if token payload is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await getDetailProject(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  it("Should return 403 if user is not registered to the project", async() => {
    jest.spyOn(PositionModel, "findOne").mockReturnValueOnce(undefined);

    const response = await getDetailProject(request);

    expect(response.code).toEqual(403);
    expect(response.message).toEqual("FORBIDDEN_ACCESS");
  });

  it("Should get all user's projects", async() => {
    const expectedResponse = new ProjectResponse(project);

    const response = await getDetailProject(request);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("PROJECT_RETRIEVED");
    expect(response.responseBody).toEqual(expectedResponse);
  });
});
