const JwtRequest = require("../jwtRequest");

class DeleteTaskRequest extends JwtRequest {
  #id;

  constructor(token, id) {
    super(token);
    this.#id = id;
  }

  getId() {
    return this.#id;
  }
}

module.exports = DeleteTaskRequest;
