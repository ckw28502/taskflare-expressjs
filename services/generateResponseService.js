function generateResponse(response) {
  return (response.responseBody) ? response.responseBody.convertToObject() : { message: response.message };
}

function generateResponses(response) {
  return (response.responseBody) ? response.responseBody.map(res => res.convertToObject()) : { message: response.message };
}

module.exports = {
  generateResponse,
  generateResponses
};
