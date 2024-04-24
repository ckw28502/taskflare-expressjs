const JwtRequest = require("../jwtRequest");

class ChangeTaskStatusRequest extends JwtRequest {
  #id;
  #status;

  constructor({ token, id, status }) {
    super(token);
    this.#id = id;
    this.#status = status;
  }

  getId() {
    return this.#id;
  }

  getStatus() {
    return this.#status;
  }

  setStatus(status) {
    this.#status = status;
  }
}

module.exports = ChangeTaskStatusRequest;
