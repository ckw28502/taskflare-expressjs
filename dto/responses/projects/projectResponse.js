const IdResponse = require("../idResponse");

class ProjectResponse extends IdResponse {
  #title;
  #description;
  #deadline;

  constructor(project) {
    super(project._id);
    this.#title = project.title;
    this.#description = project.description;
    this.#deadline = project.deadline;
  }

  convertToObject() {
    return {
      id: this._id,
      title: this.#title,
      description: this.#description,
      deadline: this.#deadline
    };
  }
}

module.exports = ProjectResponse;
