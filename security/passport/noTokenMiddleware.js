function noTokenValidation(req, res, next) {
  if (req.headers.authorization) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

module.exports = noTokenValidation;
