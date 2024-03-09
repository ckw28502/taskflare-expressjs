class RegisterRequest {
  #email;
  #password;
  #confirmationPassword;
  constructor({ email, password, confirmationPassword }) {
    this.#email = email;
    this.#password = password;
    this.#confirmationPassword = confirmationPassword;
  }

  getEmail() {
    return this.#email;
  }

  getPassword() {
    return this.#password;
  }

  getConfirmationPassword() {
    return this.#confirmationPassword;
  }
}

module.exports = RegisterRequest;
