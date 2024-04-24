const { body } = require("express-validator");
const taskEnum = require("../../../../models/task-enum.json");

function getChangeTaskStatusRequestSchema() {
  return [
    body("id").notEmpty().withMessage("TASK_ID_REQUIRED"),
    body("status")
      .notEmpty().withMessage("NEW_STATUS_REQUIRED")
      .isIn(taskEnum).withMessage("STATUS_INVALID")
  ];
}

module.exports = getChangeTaskStatusRequestSchema;
