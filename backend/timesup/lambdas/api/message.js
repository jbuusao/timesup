const Responses = require("../common/responses");
const Dynamo = require("../common/dynamo");
const WebSocket = require("../common/websocketMessage");
const {
  broadcastConnectedUsersListForRoom,
  getAllWords,
  playUser,
  StopPlayUser,
  newGame,
} = require("../common/actions");

exports.handler = (event, context, callback) => {
  console.log("event", event);
  const {
    connectionId: connectionID,
    domainName,
    stage,
  } = event.requestContext;
  // console.log(`${connectionID} STARTED MESSAGE HANDLER`);

  const send = (connectionID, message) => {
    return WebSocket.send({ domainName, stage, connectionID, message });
  };
  let body = {};
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    body = error.toString();
  }
  const message = body.message;

  if (message.ping) {
    // Execute a ping
    console.log(`${connectionID} PONG`);
    send(connectionID, `{"pong":"server"}`);
  } else if (message.connect) {
    // A user connected: create or update the session and notify all connected users
    // console.log(`${connectionID} STARTED CONNECT`);
    const username = message.connect;
    const room = message.room;
    const item = {
      connectionID,
      room: room,
      username: username,
      connected: Math.round(Date.now() / 1000),
    };
    Dynamo.createPlayer(connectionID, room, username, item, () =>
      broadcastConnectedUsersListForRoom(room, connectionID, domainName, stage)
    );
  } else if (message.listUsers) {
    // Execute the request to sync the list of users
    broadcastConnectedUsersListForRoom(
      message.room,
      connectionID,
      domainName,
      stage
    );
  } else if (message.words) {
    console.log(
      `${connectionID} RECEIVES WORDS FROM room: ${message.room} username: ${message.from}: ${message.words}`
    );
    const item = {
      connectionID: connectionID,
      room: message.room,
      username: message.from,
      words: message.words,
    };
    Dynamo.createPlayer(connectionID, message.room, message.from, item, () =>
      broadcastConnectedUsersListForRoom(
        message.room,
        connectionID,
        domainName,
        stage
      )
    );
  } else if (message.getRandomWords) {
    console.log(`${connectionID} GET RANDOM WORDS FOR ${message.from}`);
    getAllWords(connectionID, message.room, (connectionID, allWords) => {
      const response = {
        type: "randomWords",
        data: allWords,
      };
      send(connectionID, JSON.stringify(response));
    });
  } else if (message.playUser) {
    playUser(
      connectionID,
      domainName,
      stage,
      message.room,
      message.playUser,
      message.allWords
    );
  } else if (message.stopPlayUser) {
    StopPlayUser(
      domainName,
      stage,
      message.stopPlayUser,
      message.room,
      message.remainingWords,
      message.adminConnectionID
    );
  } else if (message.foundWord) {
    Dynamo.addPlayerPoint(connectionID, message.room, message.foundWord, () => {
      Dynamo.addPlayerPoint(connectionID, message.room, message.from, () => {
        broadcastConnectedUsersListForRoom(
          message.room,
          connectionID,
          domainName,
          stage
        );
      });
    });
  } else if (message.newGame) {
    Dynamo.newGame(connectionID, message.room, () => {
      broadcastConnectedUsersListForRoom(
        message.room,
        connectionID,
        domainName,
        stage
      );
    });
  } else {
    console.log(
      `${connectionID} !!!! UNRECOGNIZED MESSAGE !!!!:\n ${JSON.stringify(
        message
      )}`
    );
  }
  // console.log(`${connectionID} COMPLETED MESSAGE HANDLER`);
  callback(null, Responses._200());
};
