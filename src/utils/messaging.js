const AWS = require('aws-sdk');
const connection = require('src/models/connection');

const _getCallbackUrlForAWS = (requestContext) => {
  const { domainName, stage } = requestContext;
  return `https://${domainName}/${stage}`;
}

const send = (url, connectionId, payload) => {
  return new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: url,
    });
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId, // connectionId of the receiving ws-client
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          console.log('err is', err);
          reject(err);
        }
        resolve(data);
      }
    );
  });
};

const broadcast = async (event, room, message) => {
  const { requestContext } = event;
  const { identity }= requestContext
  console.log(requestContext);
  const connections = await connection.getByRoom(room);
  for (let i in connections) {
    const { connectionId } = connections[i];
    if (connectionId !== requestContext.connectionId) {
      try {
        await send(_getCallbackUrlForAWS(requestContext), connectionId, `[${identity.sourceIp}] - ${message}`);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports = {
  send,
  broadcast
};