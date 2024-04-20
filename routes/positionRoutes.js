const express = require("express");
const { validateToken } = require("../security/passport");
const { validateNotEmpty, validateEmpty } = require("../security/express-validator/expressValidator");
const { getToken } = require("../security/jwt");
const AddPositionRequest = require("../dto/requests/positions/addPositionRequest");
const getAddPositionSchema = require("../security/express-validator/request schemas/positions/addPositionSchema");
const addPosition = require("../services/positions/addPositionService");
const log = require("../services/logService");
const PositionRequest = require("../dto/requests/positions/positionRequest");
const removePosition = require("../services/positions/removePositionService");
const getAllPositions = require("../services/positions/getAllPositionsService");
const { generateResponses } = require("../services/generateResponseService");
const router = express.Router();

router.get("/:projectId", validateToken, validateEmpty, async(req, res) => {
  const request = new PositionRequest(getToken(req), req.params.projectId);

  const response = await getAllPositions(request);

  log(
    response.user,
    "GET_POSITIONS",
    response.code,
    response.message,
    ["POSITION"]
  );

  const responseBody = generateResponses(response);
  res.status(response.code).json(responseBody);
});

router.post("/", getAddPositionSchema(), validateToken, validateNotEmpty, async(req, res) => {
  const request = new AddPositionRequest({ token: getToken(req), ...req.body });
  const response = await addPosition(request);

  log(
    response.user,
    "CREATE_POSITION",
    response.code,
    response.message,
    ["POSITION"]
  );

  if (response.code === 201) {
    res.status(response.code).send();
  } else {
    res.status(response.code).json({ message: response.message });
  }
});

router.delete("/:projectId", validateToken, validateEmpty, async(req, res) => {
  const request = new PositionRequest(getToken(req), req.params.projectId);
  console.log(request.getToken());
  const response = await removePosition(request);

  log(
    response.user,
    "DELETE_POSITION",
    response.code,
    response.message,
    ["POSITION"]
  );

  if (response.code === 204) {
    res.status(response.code).send();
  } else {
    res.status(response.code).json({ message: response.message });
  }
});

module.exports = router;
