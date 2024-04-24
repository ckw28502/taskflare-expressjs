const JwtRequest = require("../jwtRequest");

class EditTaskRequest extends JwtRequest {
  #id;
  #positionId;
  #title;
  #description;
  #deadline;

  constructor({ token, id, positionId, title, description, deadline }) {
    super(token);
    this.#id = id;
    this.#positionId = positionId;
    this.#title = title;
    this.#description = description;
    this.#deadline = deadline;
  }

  getId() {
    return this.#id;
  }

  getPositionId() {
    return this.#positionId;
  }

  setPositionId(positionId) {
    this.#positionId = positionId;
  }

  getTitle() {
    return this.#title;
  }

  getDescription() {
    return this.#description;
  }

  getDeadline() {
    return this.#deadline;
  }

  setDeadline(deadline) {
    this.#deadline = deadline;
  }
}

module.exports = EditTaskRequest;
