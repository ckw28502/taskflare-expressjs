const { body } = require("express-validator");

function getCreateTaskRequestSchema() {
  return [
    body("projectId").notEmpty().withMessage("PROJECT_REQUIRED"),
    body("positionId").optional(),
    body("title").notEmpty().withMessage("TITLE_REQUIRED"),
    body("description").notEmpty().withMessage("DESCRIPTION_REQUIRED"),
    body("deadline").optional().isISO8601().withMessage("DATE_INVALID")
  ];
}

module.exports = getCreateTaskRequestSchema;
