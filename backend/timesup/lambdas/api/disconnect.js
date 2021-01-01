const Responses = require('../common/responses');
const Dynamo = require('../common/Dynamo');
const { broadcastConnectedUsersList } = require('../common/actions')

const sessionsTableName = process.env.sessionsTableName;

exports.handler = (event, context, callback) => {
    const { connectionId: connectionID, domainName, stage } = event.requestContext;

    console.log('event', event);

    // Delete the session record for this connection
    Dynamo.delete(connectionID, sessionsTableName).then(() => {
        // Broadcast the list of connected users
        broadcastConnectedUsersList(connectionID, domainName, stage)
    }).catch(err => console.log(`ERROR DELETING: ${err.toString()}`))
    callback(null, Responses._200({ message: 'disconnected' }))
}
