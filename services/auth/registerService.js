const UserModel = require("../../models/userModel");

async function register(request) {
  try {
    const isUserExists = await UserModel.exists({ email: request.getEmail() });
    if (isUserExists) {
      return {
        errorProtocol: 400,
        errorCode: "EMAIL_EXISTS"
      };
    }
    if (request.getPassword() !== request.getConfirmationPassword()) {
      return {
        errorProtocol: 400,
        errorCode: "PASSWORD_MISSMATCH"
      };
    }

    await UserModel.create({
      email: request.getEmail(),
      password: request.getPassword()
    });
  } catch (error) {
    console.log("error: " + error);
    return {
      errorProtocol: 500,
      errorCode: error
    };
  }
}

module.exports = register;
