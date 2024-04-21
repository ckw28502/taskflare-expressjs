const { body } = require("express-validator");

function getEditTaskRequestSchema() {
  return [
    body("id").notEmpty().withMessage("ID_REQUIRED"),
    body("positionId").optional(),
    body("title").notEmpty().withMessage("TITLE_REQUIRED"),
    body("description").notEmpty().withMessage("DESCRIPTION_REQUIRED"),
    body("deadline").optional().isISO8601().withMessage("DATE_INVALID")
  ];
}

module.exports = getEditTaskRequestSchema;
