const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
require("dotenv").config();

const users = require("../seed/users.json");
const projects = require("../seed/projects.json");
const roles = require("../seed/roles.json");
const positions = require("../seed/positions.json");
const log = require("../services/logService");
const ProjectModel = require("../models/ProjectModel");
const { hash } = require("../security/bcyrpt");
const RoleModel = require("../models/RoleModel");
const PositionModel = require("../models/PositionModel");

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
  const users = await seedUsers();
  const projects = await seedProjects();
  const roles = await seedRoles(projects);
  await seedPositions(users, projects, roles);
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
  for (let index = 0; index < insertedUsers.length; index++) {
    await log(null, "REGISTER", 201, "USER_CREATED", "USER");
  }
  return insertedUsers;
}

async function seedProjects() {
  const insertedProjects = await ProjectModel.insertMany(projects);
  for (let index = 0; index < insertedProjects.length; index++) {
    await log(null, "CREATE_PROJECT", 201, "PROJECT_CREATED", "PROJECT");
  }
  return insertedProjects;
}

async function seedRoles(projects) {
  const updatedRoles = roles.map(role => {
    role.project = projects.find(project => project.title === role.project);
    return role;
  });
  const insertedRoles = [];

  for (const role of updatedRoles) {
    if (role.managedRoles) {
      role.managedRoles = role.managedRoles.map(managedRole => insertedRoles.find(otherRole => otherRole.name === managedRole));
    }
    const newRole = await RoleModel.create(role);
    insertedRoles.push(newRole);
  }

  for (let index = 0; index < insertedRoles.length; index++) {
    await log(null, "CREATE_ROLE", 201, "ROLE_CREATED", "ROLES");
  }
  return insertedRoles;
}

async function seedPositions(users, projects, roles) {
  const updatedPositions = positions.map(position => {
    position.user = users.find(user => user.name === position.user);
    position.project = projects.find(project => project.title === position.project);
    position.role = roles.find(role => role.name === position.role);
    return position;
  });

  const insertedPositions = await PositionModel.insertMany(updatedPositions);
  for (let index = 0; index < insertedPositions.length; index++) {
    await log(null, "CREATE_POSITION", 201, "POSITION_CREATED", "POSITION");
  }
}
