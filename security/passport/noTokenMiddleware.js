function noTokenValidation(req, res, next) {
  if (req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

module.exports = noTokenValidation;
