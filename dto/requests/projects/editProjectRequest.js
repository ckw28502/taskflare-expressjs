const JwtRequest = require("../jwtRequest");

class EditProjectRequest extends JwtRequest {
  #projectId;
  #title;
  #description;
  #deadline;

  constructor({ token, projectId, title, description, deadline }) {
    super(token);
    this.#projectId = projectId;
    this.#title = title;
    this.#description = description;
    this.#deadline = deadline;
  }

  getProjectId() {
    return this.#projectId;
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
};

module.exports = EditProjectRequest;
