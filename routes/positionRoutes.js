const express = require("express");
const { validateToken } = require("../security/passport");
const { validateNotEmpty } = require("../security/express-validator/expressValidator");
const { getToken } = require("../security/jwt");
const AddPositionRequest = require("../dto/requests/positions/addPositionRequest");
const getAddPositionSchema = require("../security/express-validator/request schemas/positions/addPositionSchema");
const addPosition = require("../services/positions/addPositionService");
const log = require("../services/logService");
const router = express.Router();

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

module.exports = router;
