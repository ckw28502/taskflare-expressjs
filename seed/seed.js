const { default: mongoose } = require("mongoose");
const UserModel = require("../models/UserModel");
require("dotenv").config();

const users = require("../seed/users.json");
const projects = require("../seed/projects.json");
const log = require("../services/logService");
const ProjectModel = require("../models/ProjectModel");
const { hash } = require("../security/bcyrpt");

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
  await seedUsers();
}

async function seedUsers() {
  const insertedUsers = [];
  for (const user of users) {
    const hashedPassword = await hash(user.password);
    const newUser = await UserModel.create({
      email: user.email,
      name: user.name,
      password: hashedPassword
    });
    insertedUsers.push(newUser);
  }
  for (const user of insertedUsers) {
    await log(user, "REGISTER", 201, "USER_CREATED", "USER");
  }
}

async function seedProjects() {
  await ProjectModel.insertMany(projects);
  const insertedProjects = await ProjectModel.find();
  for (const project of insertedProjects) {
    await log(project, "CREATE_PROJECT", 201, "PROJECT_CREATED", "PROJECT");
  }
}
