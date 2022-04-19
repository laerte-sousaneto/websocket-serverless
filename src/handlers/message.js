const AWS = require('aws-sdk');
const { broadcast } = require('src/utils/messaging');

const message = async (event, context) => {
  await broadcast(event, 'main', event.body);

  return {
    statusCode: 200,
    body: 'Sent.'
  };
};

module.exports = message