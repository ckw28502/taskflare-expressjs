const { body } = require("express-validator");

function getRegisterRequestSchema(req) {
  return [
    body("email")
      .notEmpty().withMessage("EMAIL_REQUIRED")
      .isEmail().withMessage("EMAIL_INVALID"),
    body("password").notEmpty().withMessage("PASSWORD_REQUIRED"),
    body("confirmationPassword").notEmpty().withMessage("CONFIRMATION_PASSWORD_REQUIRED")
  ];
}

module.exports = getRegisterRequestSchema;
