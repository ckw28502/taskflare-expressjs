const JwtRequest = require("../jwtRequest");

class GetProjectDetailRequest extends JwtRequest {
  #projectId;

  constructor(token, projectId) {
    super(token);
    this.#projectId = projectId;
  }

  getProjectId() {
    return this.#projectId;
  }
}

module.exports = GetProjectDetailRequest;
