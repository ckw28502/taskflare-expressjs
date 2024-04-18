const { body } = require("express-validator");

function getEditProjectRequestSchema() {
  return [
    body("projectId").notEmpty().withMessage("PROJECT_ID_INVALID"),
    body("title").notEmpty().withMessage("TITLE_INVALID").optional(),
    body("description").notEmpty().withMessage("DESCRIPTION_INVALID").optional(),
    body("deadline").isISO8601().withMessage("DATE_INVALID").optional()
  ];
}

module.exports = getEditProjectRequestSchema;
