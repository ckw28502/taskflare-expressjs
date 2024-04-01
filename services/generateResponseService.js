function generateResponse(response) {
  return (response.responseBody) ? response.responseBody.convertToObject() : response.message;
}

module.exports = generateResponse;
