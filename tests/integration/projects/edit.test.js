const request = require("supertest");
const app = require("../../../app");
const db = require("../../db");

const editProject = require("../../../services/projects/editProjectService");
jest.mock("../../../services/projects/editProjectService");

const UserModel = require("../../../models/UserModel");

const userData = require("../../data/test-user.json");
const projectData = require("../../data/test-project.json");
const { generateToken } = require("../../../security/jwt");

const moment = require("moment");

const log = require("../../../services/logService");
jest.mock("../../../services/logService", () => jest.fn());

describe("Edit project integration tests", () => {
  let token;

  let user;

  const requestBody = projectData.project;

  beforeAll(async() => {
    await db.setUp();
    user = await UserModel.create(userData.user);

    token = generateToken(user._id);
  });

  afterAll(async() => {
    await db.tearDown();
  });

  async function getRequest(value) {
    return request(app)
      .put("/projects")
      .set("Authorization", `Bearer ${token}`)
      .send(value);
  }

  it("Should return 401 when token is invalid", async() => {
    jest.spyOn(UserModel, "findById").mockReturnValueOnce(undefined);

    const response = await getRequest();

    expect(response.status).toEqual(401);
  });

  const invalidRequestBodies = [
    {
      title: ""
    },
    {
      title: requestBody.title,
      description: ""
    },
    {
      deadline: moment(new Date()).format("DD/MM/YYYY"),
      ...requestBody
    }
  ];

  it.each(invalidRequestBodies)("Should return 400 if request is invalid", async(mockRequestBody) => {
    const response = await getRequest(mockRequestBody);

    expect(response.status).toEqual(400);
  });

  const requestBodies = [
    {
      title: requestBody.title
    },
    {
      description: requestBody.description
    },
    {
      deadline: new Date()
    },
    {
      title: requestBody.title,
      description: requestBody.description
    },
    {
      title: requestBody.title,
      deadline: new Date()
    },
    {
      description: requestBody.description,
      deadline: new Date()
    },
    {
      title: requestBody.title,
      description: requestBody.description,
      deadline: new Date()
    }
  ];

  it.each(requestBodies)("Should return 204 if request is valid!", async(mockRequestBody) => {
    mockRequestBody.projectId = "id";
    editProject.mockReturnValue({
      user,
      code: 204,
      message: "PROJECT_MODIFIED"
    });

    const response = await getRequest(mockRequestBody);

    expect(log).toHaveBeenCalled();
    expect(response.status).toEqual(204);
  });
});
