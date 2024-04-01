const ProjectResponse = require("../../dto/responses/projects/projectResponse");
const PositionModel = require("../../models/PositionModel");
const ProjectModel = require("../../models/ProjectModel");
const RoleModel = require("../../models/RoleModel");
const UserModel = require("../../models/UserModel");
const { decodeToken } = require("../../security/jwt");

async function getAllProjects(token) {
  const payload = decodeToken(token);
  if (!payload) {
    return {
      code: 401,
      message: "TOKEN_INVALID"
    };
  }

  const user = await UserModel.findById(payload.id);
  if (!user) {
    return {
      code: 401,
      message: "TOKEN_PAYLOAD_INVALID"
    };
  }

  const positions = await PositionModel.find({ user: user._id });

  const projectIds = [...new Set(positions.map(position => position.project))];

  const projects = await ProjectModel.find({ _id: { $in: projectIds } });

  const responseBody = Promise.all(projects.map(async(project, index) => {
    const owner = await RoleModel.findOne({
      name: "OWNER",
      project: project._id
    })
      .then(async(role) => {
        const position = await PositionModel.findOne({ role: role._id }).populate("user");
        return position.user;
      });

    return new ProjectResponse(
      index,
      project,
      owner
    );
  }));

  return {
    code: 200,
    message: "PROJECTS_RETRIEVED",
    responseBody,
    user
  };
}

module.exports = getAllProjects;
