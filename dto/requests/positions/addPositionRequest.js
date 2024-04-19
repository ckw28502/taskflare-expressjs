const PositionRequest = require("./positionRequest");

class AddPositionRequest extends PositionRequest {
  #email;

  constructor({ token, projectId, email }) {
    super(token, projectId);

    this.#email = email;
  }

  getEmail() {
    return this.#email;
  }
}

module.exports = AddPositionRequest;
