const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(email) {
  return jwt.sign({ email }, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  generateToken,
  generateRefreshToken
};
