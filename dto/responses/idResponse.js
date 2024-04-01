const BaseResponse = require("./baseResponse");

class IdResponse extends BaseResponse {
  _id;

  constructor(id) {
    super();
    this._id = id;
  }
}

module.exports = IdResponse;
