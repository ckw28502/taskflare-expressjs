const BaseResponse = require("../baseResponse");

class RefreshTokenResponse extends BaseResponse {
  #token;

  constructor(token) {
    super();
    this.#token = token;
  }

  convertToObject() {
    return { token: this.#token };
  }
}

module.exports = RefreshTokenResponse;
