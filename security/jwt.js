const jwt = require("jsonwebtoken");
require("dotenv").config();

function getToken(req) {
  return req.headers.authorization.split(" ")[1];
}

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(id) {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET);
}

function decodeToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function decodeRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  getToken,
  generateToken,
  generateRefreshToken,
  decodeToken,
  decodeRefreshToken
};
