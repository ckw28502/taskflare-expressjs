const IdResponse = require("./idResponse");

class PositionResponse extends IdResponse {
  #email;

  constructor(id, email) {
    super(id);
    this.#email = email;
  }

  convertToObject() {
    return {
      id: this._id,
      email: this.#email
    };
  }
}

module.exports = PositionResponse;
