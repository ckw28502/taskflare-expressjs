const JwtRequest = require("../jwtRequest");

class CreateProjectRequest extends JwtRequest {
  #title;
  #description;
  #deadline;

  constructor({ token, title, description, deadline }) {
    super(token);
    this.#title = title;
    this.#description = description;
    this.#deadline = deadline;
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
};

module.exports = CreateProjectRequest;
