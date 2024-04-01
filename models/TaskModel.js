const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: "Position",
    default: null
  },
  allowedRoles: [{
    type: Schema.Types.ObjectId,
    ref: "Role"
  }],
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ["OPEN", "IN PROGRESS", "CLOSED", "FINISHED"],
    default: "OPEN"
  }
});

module.exports = mongoose.model("Task", TaskSchema);
