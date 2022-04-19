const connection = require('src/models/connection');
const { broadcast } = require('src/utils/messaging');

const connect = async (event, context) => {
  console.log('attempting to connect.');
  const connectionId = event.requestContext.connectionId;

  try {
    await connection.add(connectionId, 'main');
    await broadcast(event, 'main', `Joined main room.`);
    console.log('connected');
    return {
      statusCode: 200,
      body: 'Connected.'
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: 'Failed to connect.'
    };
  }
};

module.exports = connect