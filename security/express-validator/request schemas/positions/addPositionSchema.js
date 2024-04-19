const { body } = require("express-validator");

function getAddPositionSchema(req) {
  return [
    body("projectId").notEmpty().withMessage("PROJECT_ID_REQUIRED"),
    body("userId").notEmpty().withMessage("USER_ID_REQUIRED")
  ];
}

module.exports = getAddPositionSchema;
