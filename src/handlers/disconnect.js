const connection = require('src/models/connection');
const { broadcast } = require('src/utils/messaging');

const disconnect = async (event, context) => {
  console.log(event);
  const connectionId = event.requestContext.connectionId;

  try {
    await connection.delete(connectionId);
    await broadcast(event, 'main', `Left main room.`);
    console.log('disconnected');
    return {
      statusCode: 200,
      body: 'Disconnected.'
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: 'Failed to disconnect.'
    };
  }
};

module.exports = disconnect