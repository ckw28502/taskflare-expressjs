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
const getEditTaskRequestSchema = require("../security/express-validator/request schemas/tasks/editTaskRequestSchema");
const EditTaskRequest = require("../dto/requests/tasks/editTaskRequest");
const editTask = require("../services/tasks/editTaskService");
const DeleteTaskRequest = require("../dto/requests/tasks/deleteTaskRequest");
const deleteTask = require("../services/tasks/deleteTaskService");
const getChangeTaskStatusSchema = require("../security/express-validator/request schemas/tasks/changeTaskStatusRequestSchema");
const ChangeTaskStatusRequest = require("../dto/requests/tasks/changeTaskStatusRequest");
const changeTaskStatus = require("../services/tasks/changeTaskStatusService");

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

router.patch("/", getChangeTaskStatusSchema(), validateToken, validateNotEmpty, async(req, res) => {
  const request = new ChangeTaskStatusRequest({ token: getToken(req), ...req.body });
  console.log(request);
  const response = await changeTaskStatus(request);

  log(
    response.user,
    "EDIT_TASK",
    response.code,
    response.message,
    ["TASK"]
  );

  if (response.code === 204) {
    res.status(response.code).send();
  } else {
    res.status(response.code).json({ message: response.message });
  }
});

router.put("/", getEditTaskRequestSchema(), validateToken, validateNotEmpty, async(req, res) => {
  const request = new EditTaskRequest({ token: getToken(req), ...req.body });

  const response = await editTask(request);

  log(
    response.user,
    "EDIT_TASK",
    response.code,
    response.message,
    ["TASK"]
  );

  const responseBody = generateResponse(response);
  res.status(response.code).json(responseBody);
});

router.delete("/:id", validateToken, validateEmpty, async(req, res) => {
  const request = new DeleteTaskRequest(getToken(req), req.params.id);

  const response = await deleteTask(request);

  log(
    response.user,
    "DELETE_TASK",
    response.code,
    response.message,
    ["TASK"]
  );

  if (response.code === 204) {
    res.status(response.code).send();
  } else {
    res.status(response.code).json({ message: response.message });
  }
});

module.exports = router;
