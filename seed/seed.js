const mongoose = require("mongoose");
const UserModel = require("../models/userModel");
require("dotenv").config();

const userData = require("./users.json");
const projectData = require("./projects.json");
const positionData = require("./positions.json");
const taskData = require("./tasks.json");
const log = require("../services/logService");
const ProjectModel = require("../models/projectModel");
const { hash } = require("../security/bcyrpt");
const PositionModel = require("../models/positionModel");
const TaskModel = require("../models/taskModel");

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
  const positions = await seedPositions(users, projects);
  await seedTasks(users, projects, positions);
}

async function seedUsers() {
  const insertedUsers = [];
  for (const user of userData) {
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
  const insertedProjects = await ProjectModel.insertMany(projectData);
  for (let index = 0; index < insertedProjects.length; index++) {
    await log(null, "CREATE_PROJECT", 201, "PROJECT_CREATED", "PROJECT");
  }
  return insertedProjects;
}

async function seedPositions(users, projects) {
  const updatedPositions = positionData.map(position => {
    position.user = users.find(user => user.name === position.user);
    position.project = projects.find(project => project.title === position.project);
    return position;
  });

  const insertedPositions = await PositionModel.insertMany(updatedPositions);
  for (let index = 0; index < insertedPositions.length; index++) {
    await log(null, "CREATE_POSITION", 201, "POSITION_CREATED", "POSITION");
  }

  return insertedPositions;
}

async function seedTasks(users, projects, positions) {
  const updatedTasks = taskData.map(task => {
    const user = users.find(user => user.name === task.position);
    task.project = projects.find(project => project.title === task.project);
    task.position = positions.find(position => position.user === user && position.project === task.project);
    return task;
  });

  const insertedTasks = await TaskModel.insertMany(updatedTasks);

  for (let index = 0; index < insertedTasks.length; index++) {
    await log(null, "CREATE_TASK", 201, "TASK_CREATED", "TASK");
  }
}
