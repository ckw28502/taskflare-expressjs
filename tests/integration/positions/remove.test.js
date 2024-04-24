const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const UserModel = require("../../../models/UserModel");
const ProjectModel = require("../../../models/ProjectModel");
const { generateToken } = require("../../../security/jwt");
const removePosition = require("../../../services/positions/removePositionService");
jest.mock("../../../services/positions/removePositionService");
const log = require("../../../services/logService");
const PositionModel = require("../../../models/PositionModel");
jest.mock("../../../services/logService");

describe("Remove position integration tests", () => {
  let user;

  let project;

  let token;

  beforeAll(async() => {
    await db.setUp();

    user = await UserModel.create(userData.user);

    project = await ProjectModel.create(projectData.project);

    await PositionModel.create({ user, project });

    token = generateToken(user._id);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .delete(`/positions/${project._id}`)
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

  it("Should return 204 if request is valid!", async() => {
    removePosition.mockReturnValue({
      user,
      code: 204,
      message: "USER_UNASSIGNED"
    });

    const response = await getRequest();

    expect(log).toHaveBeenCalled();
    expect(response.status).toEqual(204);
  });
});
