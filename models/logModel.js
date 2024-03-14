const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const logSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  schema: {
    type: String,
    default: null
  },
  action: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: Number,
    default: null
  },
  detail: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("Log", logSchema);
