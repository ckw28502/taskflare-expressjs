class RegisterRequest {
  #email;
  #name;
  #password;
  #confirmationPassword;

  constructor({ email, name, password, confirmationPassword }) {
    this.#email = email;
    this.#name = name;
    this.#password = password;
    this.#confirmationPassword = confirmationPassword;
  }

  getEmail() {
    return this.#email;
  }

  getName() {
    return this.#name;
  }

  getPassword() {
    return this.#password;
  }

  getConfirmationPassword() {
    return this.#confirmationPassword;
  }
}

module.exports = RegisterRequest;
