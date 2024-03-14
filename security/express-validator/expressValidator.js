const { validationResult } = require("express-validator");

function validateNotEmpty(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ message: result.errors[0].msg });
  }
  next();
}

function validateEmpty(req, res, next) {
  if (Object.keys(req.body).length > 0) {
    return res.status(400).json({ message: "REQUEST_NOT_EMPTY" });
  }
  next();
}

module.exports = { validateNotEmpty, validateEmpty };
