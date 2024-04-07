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

  isEquals(actualResponse) {
    return this.#token === actualResponse.token;
  }
}

module.exports = RefreshTokenResponse;
