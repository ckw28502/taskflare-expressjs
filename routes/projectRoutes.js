const express = require("express");
const { validateToken } = require("../security/passport");
const { validateEmpty, validateNotEmpty } = require("../security/express-validator/expressValidator");
const log = require("../services/logService");
const getCreateProjectRequestSchema = require("../security/express-validator/request schemas/projects/createProjectRequestSchema");
const { getToken } = require("../security/jwt");
const { generateResponse, generateResponses } = require("../services/generateResponseService");
const CreateProjectRequest = require("../dto/requests/projects/createProjectRequest");
const GetProjectDetailRequest = require("../dto/requests/projects/getProjectDetail");
const getAllProjects = require("../services/projects/getAllProjectsService");
const createProject = require("../services/projects/createProjectService");
const getDetailProject = require("../services/projects/getDetailProjectService");
const router = express.Router();

router.get("/", validateToken, validateEmpty, async(req, res) => {
  const token = getToken(req);
  const response = await getAllProjects(token);

  log(
    response.user,
    "GET_PROJECTS",
    response.code,
    response.message,
    ["PROJECT"]
  );

  const responseBody = generateResponses(response);
  res.status(response.code).json(responseBody);
});

router.get("/:projectId", validateToken, validateEmpty, async(req, res) => {
  const request = new GetProjectDetailRequest(getToken(req), req.params.projectId);

  const response = await getDetailProject(request);

  log(
    response.user,
    "GET_PROJECT",
    response.code,
    response.message,
    ["PROJECT"]
  );

  const responseBody = generateResponse(response);
  res.status(response.code).json(responseBody);
});

router.post("/", getCreateProjectRequestSchema(), validateToken, validateNotEmpty, async(req, res) => {
  const token = getToken(req);
  const request = new CreateProjectRequest({
    token,
    ...req.body
  });
  const response = await createProject(request);
  log(
    response.user,
    "CREATE_PROJECT",
    response.code,
    response.message,
    ["PROJECT", "POSITION"]
  );

  if (response.code === 201) {
    res.status(response.code).json({ projectId: response.responseBody });
  } else {
    res.status(response.code).json({ message: response.message });
  }
});

module.exports = router;
