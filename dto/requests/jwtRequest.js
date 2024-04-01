class JwtRequest {
  #token;

  constructor(token) {
    this.#token = token;
  }

  getToken() {
    return this.#token;
  }
}

module.exports = JwtRequest;
