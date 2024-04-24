const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const UserModel = require("../../../models/UserModel");
const ProjectModel = require("../../../models/ProjectModel");
const { generateToken } = require("../../../security/jwt");
const getAllPositions = require("../../../services/positions/getAllPositionsService");
jest.mock("../../../services/positions/getAllPositionsService");
const log = require("../../../services/logService");
const PositionModel = require("../../../models/PositionModel");
const PositionResponse = require("../../../dto/responses/positionResponse");
jest.mock("../../../services/logService");

describe("Get all positions integration tests", () => {
  let users;

  let project;

  let positions;

  let token;

  beforeAll(async() => {
    await db.setUp();

    users = await UserModel.insertMany(userData.users);

    project = await ProjectModel.create(projectData.project);

    const newPositions = users.map(user => {
      return { user, project };
    });

    positions = await PositionModel.insertMany(newPositions);

    token = generateToken(users[0]._id);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .get(`/positions/${project._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(value);
  }

  it("Should return 401 when token is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await getRequest();

    expect(response.status).toEqual(401);
  });

  it("Should return 400 if request is invalid", async() => {
    const response = await getRequest("body");

    expect(response.status).toEqual(400);
  });

  it("Should return 200 if request is valid!", async() => {
    const responseBody = positions.map(position => new PositionResponse(position._id, position.user.email));

    getAllPositions.mockReturnValue({
      user: users[0],
      code: 204,
      message: "USER_UNASSIGNED",
      responseBody
    });

    const response = await getRequest();

    expect(log).toHaveBeenCalled();
    expect(response.status).toEqual(204);
  });
});
