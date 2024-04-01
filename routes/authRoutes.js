const express = require("express");
const router = express.Router();

const getLoginRequestSchema = require("../security/express-validator/request schemas/auth/loginRequestSchema");
const getRegisterRequestSchema = require("../security/express-validator/request schemas/auth/registerRequestSchema");

const LoginRequest = require("../dto/requests/auth/loginRequest");
const RegisterRequest = require("../dto/requests/auth/registerRequest");

const log = require("../services/logService");

const login = require("../services/auth/loginService");
const register = require("../services/auth/registerService");
const refreshToken = require("../services/auth/refreshTokenService");

const { noTokenValidation, validateRefreshToken } = require("../security/passport");
const { validateNotEmpty, validateEmpty } = require("../security/express-validator/expressValidator");
const { getToken } = require("../security/jwt");
const generateResponse = require("../services/generateResponseService");

router.post("/login", getLoginRequestSchema(), noTokenValidation, validateNotEmpty, async(req, res) => {
  const request = new LoginRequest(req.body);
  const response = await login(request);

  log(
    response.user,
    "LOGIN",
    response.code,
    response.message,
    "USER"
  );

  const responseBody = generateResponse(response);
  res.status(response.code).json(responseBody);
});

router.post("/refresh", validateRefreshToken, validateEmpty, async(req, res) => {
  const token = getToken(req);
  const response = await refreshToken(token);

  log(
    response.user,
    "REGISTER",
    response.code,
    response.message
  );

  const responseBody = generateResponse(response);
  res.status(response.code).json(responseBody);
});

router.post("/register", getRegisterRequestSchema(), noTokenValidation, validateNotEmpty, async(req, res) => {
  const request = new RegisterRequest(req.body);
  const response = await register(request);

  log(
    response.user,
    "REGISTER",
    response.code,
    response.message,
    "USER"
  );

  res.status(response.code).json({ message: response.message });
});

module.exports = router;
