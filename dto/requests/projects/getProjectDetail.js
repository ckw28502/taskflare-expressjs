class GetProjectDetailRequest {
  #token;
  #projectId;

  constructor(token, projectId) {
    this.#token = token;
    this.#projectId = projectId;
  }

  getToken() {
    return this.#token;
  }

  getProjectId() {
    return this.#projectId;
  }
}

module.exports = GetProjectDetailRequest;
