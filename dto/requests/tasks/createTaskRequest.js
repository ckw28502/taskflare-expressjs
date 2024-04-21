const JwtRequest = require("../jwtRequest");

class CreateTaskRequest extends JwtRequest {
  #projectId;
  #positionId;
  #title;
  #description;
  #deadline;

  constructor({ token, projectId, positionId, title, description, deadline }) {
    super(token);
    this.#projectId = projectId;
    this.#positionId = positionId;
    this.#title = title;
    this.#description = description;
    this.#deadline = deadline;
  }

  getProjectId() {
    return this.#projectId;
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

module.exports = CreateTaskRequest;
