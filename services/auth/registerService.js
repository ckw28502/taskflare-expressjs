const UserModel = require("../../models/userModel");

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
  const hashedPassword = hash(request.getPassword());
  await UserModel.create({
    email: request.getEmail(),
    password: hashedPassword
  });
  return {
    code: 201,
    message: "USER_CREATED"
  };
}

module.exports = register;
