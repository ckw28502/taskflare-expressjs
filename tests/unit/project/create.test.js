const UserModel = require("../../../models/UserModel");
const ProjectModel = require("../../../models/ProjectModel");
const PositionModel = require("../../../models/PositionModel");
const db = require("../db");
const projectData = require("../../data/test-project.json");

const createProject = require("../../../services/projects/createProjectService");

const { decodeToken } = require("../../../security/jwt");
const CreateProjectRequest = require("../../../dto/requests/projects/createProjectRequest");

const userData = require("../../data/test-user.json");

jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});

describe("Create Project unit tests", () => {
  let request;

  let user;

  let today;

  beforeAll(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);

    request = new CreateProjectRequest({
      token: "token",
      ...projectData.project
    });
  });

  beforeEach(() => {
    today = new Date();
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

    const response = await createProject(request);

    expect(createProjectSpy).toHaveBeenCalled();
    expect(createPositionSpy).toHaveBeenCalled();

    expect(response.code).toEqual(201);
    expect(response.message).toEqual("PROJECT_CREATED");
  });

  it("Should return 400 if date is invalid", async() => {
    decodeToken.mockReturnValue(user._id);
    mockUserFindById(user);

    const yesterday = today.setDate(today.getDate() - 1);
    request.setDeadline(yesterday);

    const response = await createProject(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("PROJECT_DEADLINE_INVALID");
  });

  it("Should create new project with deadline", async() => {
    decodeToken.mockReturnValue(user._id);
    mockUserFindById(user);

    const tomorrow = today.setDate(today.getDate() + 1);
    request.setDeadline(tomorrow);

    const response = await createProject(request);

    expect(createProjectSpy).toHaveBeenCalled();
    expect(createPositionSpy).toHaveBeenCalled();

    expect(response.code).toEqual(201);
    expect(response.message).toEqual("PROJECT_CREATED");
  });
});
