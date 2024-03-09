const bcrypt = require("bcrypt");

const salt = 10;

function hash(text) {
  return bcrypt.hashSync(text, salt);
}

module.exports = { hash };
