const express = require("express");
const getCreateTaskRequestSchema = require("../security/express-validator/request schemas/tasks/createTaskRequestSchema");
const router = express.Router();
const { validateToken } = require("../security/passport");
const { validateNotEmpty, validateEmpty } = require("../security/express-validator/expressValidator");
const CreateTaskRequest = require("../dto/requests/tasks/createTaskRequest");
const { getToken } = require("../security/jwt");
const createTask = require("../services/tasks/createTaskService");
const log = require("../services/logService");
const { generateResponse, generateResponses } = require("../services/generateResponseService");
const GetAllTasksRequest = require("../dto/requests/tasks/getAllTasksRequest");
const getAllTasks = require("../services/tasks/getAllTasksService");

router.get("/:projectId", validateToken, validateEmpty, async(req, res) => {
  const request = new GetAllTasksRequest(getToken(req), req.params.projectId);

  const response = await getAllTasks(request);

  log(
    response.user,
    "GET_TASKS",
    response.code,
    response.message,
    ["TASK"]
  );

  const responseBody = generateResponses(response);

  res.status(response.code).json(responseBody);
});

router.post("/", getCreateTaskRequestSchema(), validateToken, validateNotEmpty, async(req, res) => {
  const request = new CreateTaskRequest({
    token: getToken(req),
    ...req.body
  });

  const response = await createTask(request);

  log(
    response.user,
    "CREATE_TASK",
    response.code,
    response.message,
    ["TASK"]
  );

  const responseBody = generateResponse(response);
  res.status(response.code).json(responseBody);
});

module.exports = router;
