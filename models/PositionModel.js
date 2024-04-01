const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PositionSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedTasks: [{
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task"
    },
    date: {
      type: Date,
      required: true
    }
  }],
  isDeleted: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("Position", PositionSchema);
