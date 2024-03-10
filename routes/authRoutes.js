const express = require("express");
const router = express.Router();

const loginRequestSchema = require("../security/express-validator/request schemas/auth/loginRequestSchema");
const registerRequestSchema = require("../security/express-validator/request schemas/auth/registerRequestSchema");

const LoginRequest = require("../dto/requests/auth/loginRequest");
const RegisterRequest = require("../dto/requests/auth/registerRequest");

const log = require("../services/logService");

const login = require("../services/auth/loginService");
const register = require("../services/auth/registerService");

const noTokenValidation = require("../security/passport/noTokenMiddleware");
const requestBodyValidation = require("../security/express-validator/expressValidator");

router.post("/login", loginRequestSchema(), noTokenValidation, requestBodyValidation, (req, res) => {
  const request = new LoginRequest(req.body);
  res.json(login(request));
});

router.post("/register", registerRequestSchema(), noTokenValidation, requestBodyValidation, async(req, res) => {
  const request = new RegisterRequest(req.body);
  const response = await register(request);
  log({
    user: response.user,
    action: "REGISTER",
    status: response.code,
    detail: response.message,
    schema: "USER"
  });
  res.status(response.code).json({ message: response.message });
});

module.exports = router;
