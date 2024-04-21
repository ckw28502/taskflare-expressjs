const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    enum: ["PLANNED", "IN PROGRESS", "FINISHED"],
    default: "PLANNED"
  }
});

module.exports = mongoose.model("Task", TaskSchema);
