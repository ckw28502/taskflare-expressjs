const db = require("../db");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const UserModel = require("../../../models/userModel");
const ProjectModel = require("../../../models/projectModel");
const PositionModel = require("../../../models/positionModel");
const { decodeToken } = require("../../../security/jwt");
const removePosition = require("../../../services/positions/removePositionService");
const PositionRequest = require("../../../dto/requests/positions/positionRequest");
jest.mock("../../../security/jwt", () => {
  return {
    decodeToken: jest.fn()
  };
});
describe("Remove position unit tests", () => {
  let request;

  let user;

  let project;

  let position;

  beforeEach(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);

    project = await ProjectModel.create(projectData.project);

    position = await PositionModel.create({ user, project });

    request = new PositionRequest("token", project._id);

    decodeToken.mockReturnValue(user);
  });

  afterEach(async() => {
    await db.tearDown();
  });

  it("Should return 401 if token is invalid", async() => {
    decodeToken.mockReturnValueOnce(undefined);
    const response = await removePosition(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_INVALID");
  });

  it("Should return 401 if token payload is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await removePosition(request);

    expect(response.code).toEqual(401);
    expect(response.message).toEqual("TOKEN_PAYLOAD_INVALID");
  });

  it("Should return 400 if project is not found", async() => {
    jest.spyOn(ProjectModel, "findById").mockReturnValueOnce(undefined);

    const response = await removePosition(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("PROJECT_NOT_FOUND");
  });

  it("Should return 400 if user is not assigned", async() => {
    jest.spyOn(PositionModel, "findOne").mockReturnValueOnce(undefined);

    const response = await removePosition(request);

    expect(response.code).toEqual(400);
    expect(response.message).toEqual("USER_NOT_ASSIGNED");
  });

  it("Should remove user from project", async() => {
    const response = await removePosition(request);

    expect(response.code).toEqual(204);
    expect(response.message).toEqual("USER_UNASSIGNED");

    const removedPosition = await PositionModel.findById(position._id);
    expect(removedPosition.isDeleted).not.toBeNull();
  });
});
