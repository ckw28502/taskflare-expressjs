const LogModel = require("../models/LogModel");

async function log(user, action, status, detail, schema = null) {
  await LogModel.create({
    user,
    action,
    status,
    detail,
    schema,
    date: new Date()
  });
}

module.exports = log;
