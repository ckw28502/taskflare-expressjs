const db = require("../db");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const UserModel = require("../../../models/UserModel");
const ProjectModel = require("../../../models/ProjectModel");
const PositionModel = require("../../../models/PositionModel");
const AddPositionRequest = require("../../../dto/requests/positions/addPositionRequest");
const { decodeToken } = require("../../../security/jwt");
const addPosition = require("../../../services/positions/addPositionService");
jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});
describe("Add position unit tests", () => {
  let request;

  let users;

  let project;

  let position;

  beforeEach(async() => {
    await db.setUp();

    users = await UserModel.insertMany(userData.users);

    project = await ProjectModel.create(projectData.project);

    position = await PositionModel.create({ user: users[0], project });

    request = new AddPositionRequest({
      token: "token",
      projectId: project._id,
      email: users[1].email
    });

    decodeToken.mockReturnValue(users[0]);
  });

  afterEach(async() => {
    await db.tearDown();
  });

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValueOnce(undefined);
    const response = await addPosition(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  it("Should return 401 if token payload is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await addPosition(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  it("Should return 400 if project is not found", async() => {
    jest.spyOn(ProjectModel, "findById").mockReturnValueOnce(undefined);

    const response = await addPosition(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("PROJECT_NOT_FOUND");
  });

  it("Should return 403 if user is unauthorized", async() => {
    jest.spyOn(PositionModel, "findOne").mockReturnValueOnce(undefined);

    const response = await addPosition(request);

    expect(response.code).toEqual(403);
    expect(response.message).toEqual("FORBIDDEN_ACCESS");
  });

  it("Should return 400 if user is not found", async() => {
    jest.spyOn(UserModel, "findOne")
      .mockReturnValueOnce(users[0])
      .mockReturnValueOnce(undefined);

    const response = await addPosition(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("USER_NOT_FOUND");
  });

  it("Should return 400 if user is assigned", async() => {
    jest.spyOn(PositionModel, "findOne").mockReturnValueOnce(position);

    await PositionModel.create({ user: users[1], project });

    const response = await addPosition(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("USER_ALREADY_ASSIGNED");
  });

  it("Should return 400 if user is assigned", async() => {
    const createPositionSpy = jest.spyOn(PositionModel, "create");

    const response = await addPosition(request);

    expect(createPositionSpy).toHaveBeenCalled();

    expect(response.code).toEqual(201);
    expect(response.message).toEqual("USER_ASSIGNED");
  });
});
