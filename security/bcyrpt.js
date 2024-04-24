const bcrypt = require("bcrypt");

const salt = 10;

async function hash(text) {
  return await bcrypt.hash(text, salt);
}

async function match(text, hashedText) {
  return await bcrypt.compare(text, hashedText);
}

module.exports = { hash, match };
