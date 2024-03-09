const { body } = require("express-validator");

function getLoginRequestSchema(req) {
  return [
    body("email")
      .notEmpty().withMessage("Email address is required!")
      .isEmail().withMessage("Invalid email provided!"),
    body("password").notEmpty().withMessage("Password is required!")
  ];
}

module.exports = getLoginRequestSchema;
