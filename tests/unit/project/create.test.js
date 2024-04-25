const UserModel = require("../../../models/userModel");
const ProjectModel = require("../../../models/projectModel");
const PositionModel = require("../../../models/positionModel");
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

    project = await ProjectModel.create(projectData.project);

    request = new CreateProjectRequest({
      token: "token",
      ...projectData.project
    });

    decodeToken.mockReturnValue(user._id);
  });

  beforeEach(async() => {
    today = new Date();
  });

  afterAll(async() => await db.tearDown());

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValueOnce(undefined);
    const response = await createProject(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  it("Should return 401 if token payload is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await createProject(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  const createProjectSpy = jest.spyOn(ProjectModel, "create");
  const createPositionSpy = jest.spyOn(PositionModel, "create");

  it("Should create new project without deadline", async() => {
    createProjectSpy.mockReturnValue(project);

    const response = await createProject(request);

    expect(createPositionSpy).toHaveBeenCalled();

    expect(response.code).toEqual(201);
    expect(response.message).toEqual("PROJECT_CREATED");
    expect(response.responseBody).toEqual(project._id);
  });

  it("Should return 400 if date is invalid", async() => {
    const yesterday = today.setDate(today.getDate() - 1);
    request.setDeadline(moment(yesterday).format("YYYY-MM-DD"));

    const response = await createProject(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("PROJECT_DEADLINE_INVALID");
  });

  it("Should create new project with deadline", async() => {
    const tomorrow = today.setDate(today.getDate() + 1);
    request.setDeadline(moment(tomorrow).format("YYYY-MM-DD"));

    project.deadline = tomorrow;

    createProjectSpy.mockReturnValue(project);

    const response = await createProject(request);

    expect(createPositionSpy).toHaveBeenCalled();

    expect(response.code).toEqual(201);
    expect(response.message).toEqual("PROJECT_CREATED");
    expect(response.responseBody).toEqual(project._id);
  });
});
