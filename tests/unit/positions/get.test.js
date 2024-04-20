const db = require("../db");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const UserModel = require("../../../models/UserModel");
const ProjectModel = require("../../../models/ProjectModel");
const PositionModel = require("../../../models/PositionModel");
const PositionRequest = require("../../../dto/requests/positions/positionRequest");
const { decodeToken } = require("../../../security/jwt");
const getAllPositions = require("../../../services/positions/getAllPositionsService");
const PositionResponse = require("../../../dto/responses/positionResponse");
jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});
describe("Get all positions unit tests", () => {
  let request;

  let users;

  let project;

  let positions;

  beforeEach(async() => {
    await db.setUp();

    users = await UserModel.insertMany(userData.users);

    project = await ProjectModel.create(projectData.project);

    const newPositions = users.map(user => {
      return { user, project };
    });

    positions = await PositionModel.insertMany(newPositions);

    request = new PositionRequest("token", project._id);

    decodeToken.mockReturnValue(users[0]);
  });

  afterEach(async() => {
    await db.tearDown();
  });

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValueOnce(undefined);

    const response = await getAllPositions(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  it("Should return 401 if token payload is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await getAllPositions(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  it("Should return 400 if project is not found", async() => {
    jest.spyOn(ProjectModel, "findById").mockReturnValueOnce(undefined);

    const response = await getAllPositions(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("PROJECT_NOT_FOUND");
  });

  it("Should return 403 if user is unauthorized", async() => {
    jest.spyOn(PositionModel, "findOne").mockReturnValueOnce(undefined);

    const response = await getAllPositions(request);

    expect(response.code).toEqual(403);
    expect(response.message).toEqual("FORBIDDEN_ACCESS");
  });

  it("Should get positions", async() => {
    const responseBody = positions.map(position => new PositionResponse(position._id, position.user.email));

    const response = await getAllPositions(request);

    expect(response.code).toEqual(200);
    expect(response.message).toEqual("POSITIONS_RETRIEVED");
    expect(response.responseBody).toEqual(responseBody);
  });
});
