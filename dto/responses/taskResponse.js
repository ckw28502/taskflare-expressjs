const IdResponse = require("./idResponse");

class TaskResponse extends IdResponse {
  #assigneeId;
  #assigneeEmail;
  #assigneeName;
  #title;
  #description;
  #deadline;
  #status;

  constructor(task) {
    super(task.id);
    this.#title = task.title;
    this.#description = task.description;
    this.#deadline = task.deadline;
    this.#status = task.status;
    if (task.position) {
      const position = task.position;
      this.#assigneeId = position._id;
      this.#assigneeEmail = position.user.email;
      this.#assigneeName = position.user.name;
    }
  }

  convertToObject() {
    return {
      id: this._id,
      title: this.#title,
      description: this.#description,
      deadline: this.#deadline,
      assigneeId: this.#assigneeId,
      assigneeEmail: this.#assigneeEmail,
      assigneeName: this.#assigneeName,
      status: this.#status
    };
  }
}

module.exports = TaskResponse;
