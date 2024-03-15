const { default: mongoose } = require("mongoose");
const UserModel = require("../models/UserModel");
require("dotenv").config();

const users = require("../seed/user.json");
const log = require("../services/logService");

/**
 * Connect to database
 */

mongoose.connect(process.env.MONGODB_URI, {
  user: process.env.MONGODB_ROOT_USERNAME,
  pass: process.env.MONGODB_ROOT_PASSWORD
}).then(async() => {
  await seed();
  console.log("Database seeding finished!");
  process.exit(0);
}).catch(error => console.log("Error : " + error));

async function seed() {
  // Seed users
  await UserModel.insertMany(users);
  const insertedUsers = await UserModel.find();
  for (const user of insertedUsers) {
    await log(user, "REGISTER", 200, "USER_CREATED", "USER");
  }
}
