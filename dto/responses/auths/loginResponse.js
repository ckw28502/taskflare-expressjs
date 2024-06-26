const BaseResponse = require("../baseResponse");

class LoginResponse extends BaseResponse {
  #token;
  #refreshToken;

  constructor(token, refreshToken) {
    super();
    this.#token = token;
    this.#refreshToken = refreshToken;
  }

  convertToObject() {
    return {
      token: this.#token,
      refreshToken: this.#refreshToken
    };
  }
}

module.exports = LoginResponse;
