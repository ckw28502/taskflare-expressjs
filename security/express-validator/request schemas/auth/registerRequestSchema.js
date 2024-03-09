const { body } = require("express-validator");

function getRegisterRequestSchema(req) {
  return [
    body("email")
      .notEmpty().withMessage("Email address is required!")
      .isEmail().withMessage("Invalid email provided!"),
    body("password").notEmpty().withMessage("Password is required!"),
    body("confirmationPassword").notEmpty().withMessage("Confirmation password is required!")
  ];
}

module.exports = getRegisterRequestSchema;
