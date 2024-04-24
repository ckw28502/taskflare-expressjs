const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const UserModel = require("../../../models/UserModel");
const ProjectModel = require("../../../models/ProjectModel");
const { generateToken } = require("../../../security/jwt");
const addPosition = require("../../../services/positions/addPositionService");
jest.mock("../../../services/positions/addPositionService");
const log = require("../../../services/logService");
const PositionModel = require("../../../models/PositionModel");
jest.mock("../../../services/logService");

describe("Add position integration tests", () => {
  let users;

  let project;

  let token;

  beforeAll(async() => {
    await db.setUp();

    users = await UserModel.insertMany(userData.users);

    project = await ProjectModel.create(projectData.project);

    await PositionModel.create({ user: users[0], project });

    token = generateToken(users[0]._id);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .post("/positions")
      .set("Authorization", `Bearer ${token}`)
      .send(value);
  }

  it("Should return 401 when token is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await getRequest();

    expect(response.status).toEqual(401);
  });

  const invalidRequestBodies = [
    {},
    {
      project: "id"
    },
    {
      project: "id",
      email: "name"
    }
  ];

  it.each(invalidRequestBodies)("Should return 400 if request is invalid", async(mockRequestBody) => {
    const response = await getRequest(mockRequestBody);

    expect(response.status).toEqual(400);
  });

  it("Should return 201 if request is valid!", async() => {
    addPosition.mockReturnValue({
      user: users[0],
      code: 201,
      message: "USER_ASSIGNED"
    });

    const response = await getRequest({
      projectId: project._id,
      email: users[1].email
    });

    expect(log).toHaveBeenCalled();
    expect(response.status).toEqual(201);
  });
});
