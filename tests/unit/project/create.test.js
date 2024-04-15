const UserModel = require("../../../models/UserModel");
const ProjectModel = require("../../../models/ProjectModel");
const PositionModel = require("../../../models/PositionModel");
const db = require("../db");
const projectData = require("../../data/test-project.json");

const createProject = require("../../../services/projects/createProjectService");

const { decodeToken } = require("../../../security/jwt");
const CreateProjectRequest = require("../../../dto/requests/projects/createProjectRequest");

const userData = require("../../data/test-user.json");
const moment = require("moment");

jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});

describe("Create Project unit tests", () => {
  let request;

  let user;

  let today;

  let project;

  beforeAll(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);

    request = new CreateProjectRequest({
      token: "token",
      ...projectData.project
    });
  });

  beforeEach(async() => {
    today = new Date();

    project = await ProjectModel.create(projectData.project);
  });

  afterAll(async() => await db.tearDown());

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValue(null);

    const response = await createProject(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  function mockUserFindById(value) {
    jest.spyOn(UserModel, "findById").mockReturnValue(value);
  }

  it("Should return 401 if token payload is invalid", async() => {
    decodeToken.mockReturnValue(user._id);
    mockUserFindById(null);

    const response = await createProject(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  const createProjectSpy = jest.spyOn(ProjectModel, "create");
  const createPositionSpy = jest.spyOn(PositionModel, "create");

  it("Should create new project without deadline", async() => {
    decodeToken.mockReturnValue(user._id);
    mockUserFindById(user);

    createProjectSpy.mockReturnValue(project);

    const response = await createProject(request);

    expect(createPositionSpy).toHaveBeenCalled();

    expect(response.code).toEqual(201);
    expect(response.message).toEqual("PROJECT_CREATED");
    expect(response.responseBody).toEqual(project._id);
  });

  it("Should return 400 if date is invalid", async() => {
    decodeToken.mockReturnValue(user._id);
    mockUserFindById(user);

    const yesterday = today.setDate(today.getDate() - 1);
    request.setDeadline(moment(yesterday).format("YYYY-MM-DD"));

    const response = await createProject(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("PROJECT_DEADLINE_INVALID");
  });

  it("Should create new project with deadline", async() => {
    decodeToken.mockReturnValue(user._id);
    mockUserFindById(user);

    const tomorrow = today.setDate(today.getDate() + 1);
    request.setDeadline(moment(tomorrow).format("YYYY-MM-DD"));

    project.deadline = tomorrow;

    createProjectSpy.mockReturnValue(project);

    const response = await createProject(request);

    expect(createPositionSpy).toHaveBeenCalled();

    expect(response.code).toEqual(201);
    expect(response.message).toEqual("PROJECT_CREATED");
    expect(response.responseBody).toEqual(project._id);
    expect(response.user).toEqual(user);
  });
});
