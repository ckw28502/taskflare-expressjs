const IdResponse = require("../idResponse");

class ProjectResponse extends IdResponse {
  #title;
  #ownerId;
  #ownerName;
  #description;
  #deadline;

  constructor(id, project, owner) {
    super(id);
    this.#title = project.title;
    this.#description = project.description;
    this.#deadline = project.deadline;
    this.#ownerId = owner._id;
    this.#ownerName = owner.name;
  }

  convertToObject() {
    return {
      id: this._id,
      title: this.#title,
      ownerId: this.#ownerId,
      ownerName: this.#ownerName,
      description: this.#description,
      deadline: this.#deadline
    };
  }
}

module.exports = ProjectResponse;
