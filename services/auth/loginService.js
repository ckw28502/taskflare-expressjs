const User = require("../../models/userModel");

async function login(request) {
  const user = User.findOne({ email: request.getEmail() });
}

module.exports = login;
