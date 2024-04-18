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
  isDeleted: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("Position", PositionSchema);
