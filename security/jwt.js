const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(id) {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET);
}

function decodeRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  generateToken,
  generateRefreshToken,
  decodeRefreshToken
};
