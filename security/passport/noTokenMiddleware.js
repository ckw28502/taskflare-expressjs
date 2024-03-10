function noTokenValidation(req, res, next) {
  if (req.headers.authorization) {
    return res.status(403).json({ message: "FORBIDDEN_ACCESS" });
  }
  next();
}

module.exports = noTokenValidation;
