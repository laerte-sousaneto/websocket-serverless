const AWS = require('aws-sdk');

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const getByRoom = async (room) => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    "ScanIndexForward": true,
    "FilterExpression": "#DYNOBASE_room = :room",
    "ExpressionAttributeNames": {
      "#DYNOBASE_room": "room"
    },
    "ExpressionAttributeValues": {
      ":room": "main"
    }
  };

  try {
    const { Items } = await dynamoDbClient.scan(params).promise();
    return Items;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const add = (connectionId, room) => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    Item: {
      connectionId: connectionId,
      room: room,
    },
  };

  return dynamoDbClient.put(params).promise()
};

const deleteItem = (connectionId) => {
  console.log(`Deleting connection: ${connectionId}`)
  return dynamoDbClient.delete({
    "TableName": CONNECTIONS_TABLE,
    "Key": {
      "connectionId": connectionId
    }
  }).promise()
}

module.exports = {
  add,
  getByRoom,
  delete: deleteItem
};