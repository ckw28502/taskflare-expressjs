const PositionRequest = require("./positionRequest");

class AddPositionRequest extends PositionRequest {
  #userId;

  constructor({ token, projectId, userId }) {
    super(token, projectId);

    this.#userId = userId;
  }

  getUserId() {
    return this.#userId;
  }
}

module.exports = AddPositionRequest;