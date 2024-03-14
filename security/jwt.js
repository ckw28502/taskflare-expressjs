const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(id) {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET);
}

function decodeToken(token) {
  return jwt.decode(token, { complete: true }).payload;
}

module.exports = {
  generateToken,
  generateRefreshToken,
  decodeToken
};
