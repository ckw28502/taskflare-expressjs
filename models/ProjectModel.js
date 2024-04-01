const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = Schema({
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
    enum: ["PLANNED", "STARTED", "PAUSED", "LATE", "CANCELLED", "STOPPED", "FINISHED"],
    default: "PLANNED"
  }
});

module.exports = mongoose.model("Project", ProjectSchema);
