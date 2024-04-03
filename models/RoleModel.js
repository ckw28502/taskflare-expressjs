const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleSchema = Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  managedRoles: [{
    type: Schema.Types.ObjectId,
    ref: "Role"
  }],
  name: {
    type: String,
    required: true
  },
  isDeletable: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Role", RoleSchema);
