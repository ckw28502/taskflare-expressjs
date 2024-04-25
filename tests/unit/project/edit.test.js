const UserModel = require("../../../models/userModel");
const ProjectModel = require("../../../models/projectModel");
const db = require("../db");
const projectData = require("../../data/test-project.json");

const editProject = require("../../../services/projects/editProjectService");

const { decodeToken } = require("../../../security/jwt");
const EditProjectRequest = require("../../../dto/requests/projects/editProjectRequest");

const userData = require("../../data/test-user.json");
const moment = require("moment");
const PositionModel = require("../../../models/positionModel");

jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});

describe("Edit Project unit tests", () => {
  let token;

  let request;

  let project;

  let today;

  beforeAll(async() => {
    await db.setUp();

    const user = await UserModel.create(userData.user);

    project = await ProjectModel.create(projectData.project);

    await PositionModel.create({ user, project });

    request = new EditProjectRequest({
      token: "token",
      projectId: project._id,
      title: "Modified Project",
      description: "Project modified!"
    });

    decodeToken.mockReturnValue(user._id);
  });

  beforeEach(async() => {
    today = new Date();
  });

  afterAll(async() => await db.tearDown());

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValueOnce(undefined);
    const response = await editProject(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  it("Should return 401 if token payload is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await editProject(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  it("Should return 400 if project not found", async() => {
    jest.spyOn(ProjectModel, "findById").mockReturnValueOnce(undefined);

    const response = await editProject(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("PROJECT_NOT_FOUND");
  });

  it("Should return 403 if position not found", async() => {
    jest.spyOn(PositionModel, "findOne").mockReturnValueOnce(undefined);

    const response = await editProject(request);

    expect(response.code).toEqual(403);
    expect(response.message).toEqual("FORBIDDEN_ACCESS");
  });

  it("Should return 400 if date is invalid", async() => {
    const yesterday = today.setDate(today.getDate() - 1);
    request.setDeadline(moment(yesterday).format("YYYY-MM-DD"));

    const response = await editProject(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("DEADLINE_INVALID");
  });

  const requests = [
    { title: "modified title" },
    { description: "modified description" },
    { deadline: true },
    { title: "modified title", description: "modified description" },
    { title: "modified title", deadline: true },
    { description: "modified description", deadline: true },
    request
  ];

  it.each(requests)("Should edit the project", async(newData) => {
    if (newData && newData.deadline) {
      const tomorrow = today.setDate(today.getDate() + 1);
      newData.deadline = moment(tomorrow).format("YYYY-MM-DD");
    }
    const newRequest = new EditProjectRequest({
      token,
      projectId: project._id,
      ...newData
    });

    const response = await editProject(newRequest);

    expect(response.code).toEqual(204);
    expect(response.message).toEqual("PROJECT_MODIFIED");

    expect(project).not.toEqual(await ProjectModel.findById(newRequest.getProjectId()));
  });
});
