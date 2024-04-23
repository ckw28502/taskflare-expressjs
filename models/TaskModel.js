const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const taskEnum = require("./task-enum.json");

const TaskSchema = Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: "Position",
    default: null
  },
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
    enum: taskEnum,
    default: "PLANNED"
  }
});

module.exports = mongoose.model("Task", TaskSchema);
