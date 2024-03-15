const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let server;

async function setUp() {
  server = await MongoMemoryServer.create();
  const mongoUri = server.getUri();
  await mongoose.connect(mongoUri);
}

async function tearDown() {
  await mongoose.disconnect();
  await server.stop();
}

module.exports = { setUp, tearDown };
