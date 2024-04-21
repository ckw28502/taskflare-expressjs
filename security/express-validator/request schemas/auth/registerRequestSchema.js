const { body } = require("express-validator");

function getRegisterRequestSchema() {
  return [
    body("email")
      .notEmpty().withMessage("EMAIL_REQUIRED")
      .isEmail().withMessage("EMAIL_INVALID"),
    body("name").notEmpty().withMessage("NAME_REQUIRED"),
    body("password").notEmpty().withMessage("PASSWORD_REQUIRED"),
    body("confirmationPassword").notEmpty().withMessage("CONFIRMATION_PASSWORD_REQUIRED")
  ];
}

module.exports = getRegisterRequestSchema;
