const { body } = require("express-validator");

function getAddPositionSchema(req) {
  return [
    body("projectId").notEmpty().withMessage("PROJECT_ID_REQUIRED"),
    body("email")
      .notEmpty().withMessage("EMAIL_REQUIRED")
      .isEmail().withMessage("EMAIL_INVALID")
  ];
}

module.exports = getAddPositionSchema;
