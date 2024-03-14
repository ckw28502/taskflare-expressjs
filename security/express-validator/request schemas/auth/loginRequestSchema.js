const { body } = require("express-validator");

function getLoginRequestSchema(req) {
  return [
    body("email")
      .notEmpty().withMessage("EMAIL_REQUIRED")
      .isEmail().withMessage("EMAIL_INVALID"),
    body("password").notEmpty().withMessage("PASSWORD_REQUIRED")
  ];
}

module.exports = getLoginRequestSchema;
