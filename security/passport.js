const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");

require("dotenv").config();

const UserModel = require("../models/userModel");

function noTokenValidation(req, res, next) {
  if (req.headers.authorization) {
    return res.status(403).json({ message: "FORBIDDEN_ACCESS" });
  }
  next();
}

async function validate(payload, done, isToken) {
  if (isToken) {
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return done(null, false, { message: "TOKEN_EXPIRED" });
    }
  }

  const user = await UserModel.findById(payload.id);
  return done(null, user);
}

passport.use("token", new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async(payload, done) => await validate(payload, done, true)));

const validateToken = passport.authenticate("token", { session: false });

passport.use("refreshToken", new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_REFRESH_SECRET
}, async(payload, done) => await validate(payload, done, false)));

const validateRefreshToken = passport.authenticate("refreshToken", { session: false });

module.exports = {
  noTokenValidation,
  validateToken,
  validateRefreshToken
};
