const UserModel = require("../../models/UserModel");

const { hash } = require("../../security/bcyrpt");

async function register(request) {
  const isUserExists = await UserModel.exists({ email: request.getEmail() });

  if (isUserExists) {
    return {
      code: 400,
      message: "EMAIL_EXISTS"
    };
  }

  if (request.getPassword() !== request.getConfirmationPassword()) {
    return {
      code: 400,
      message: "PASSWORD_MISSMATCH"
    };
  }

  const hashedPassword = await hash(request.getPassword());

  const user = await UserModel.create({
    email: request.getEmail(),
    name: request.getName(),
    password: hashedPassword
  });

  return {
    user,
    code: 201,
    message: "USER_CREATED"
  };
}

module.exports = register;
