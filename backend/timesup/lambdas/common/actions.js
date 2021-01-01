const AWS = require('aws-sdk')
const WebSocket = require('../common/websocketMessage')

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
})

const client = new AWS.DynamoDB.DocumentClient()
const playerTable = 'timesup_players'
const sessionTable = process.env.sessionsTableName
const sessionIndex = process.env.sessionsIndexName

/*
 *  Broadcast the list of connected users to all connected users
 */
export const broadcastConnectedUsersList = async (
  room,
  connectionID,
  domainName,
  stage
) => {
  // console.log(`${connectionID} STARTED LIST USERS`);
  client
    .scan({ TableName: sessionTable, IndexName: sessionIndex })
    .promise()
    .then((result) => {
      // console.log(`${connectionID} LIST USERS 1`);
      // Gather the list of connect user's usernames
      const users = []
      result.Items.forEach((item) => users.push(item.username))
      // console.log(`${connectionID} LIST USERS 2 -> ${users.length} users`);
      const msg = JSON.stringify({ type: 'usersChanged', users: users })

      // Send the usersChanged event to all connected users
      // console.log(`${connectionID} LIST USERS 3 SENDING TO MOBILE: ${msg}`)
      result.Items.forEach((item) => {
        if (item.connectionID) {
          WebSocket.send({
            domainName,
            stage,
            connectionID: item.connectionID,
            message: msg,
          }).catch((err) =>
            console.log(
              `${connectionID} LIST USERS ACK FAILED ${connectionID} ${domainName} ${stage}: ${err.toString()}`
            )
          )
        }
      })
    })
    .catch((err) => {
      console.log(`${connectionID} LIST USERS ERR SCAN! ${err.toString()}`)
    })
  // console.log(`${connectionID} COMPLETED LIST USERS`);
}

export const broadcastConnectedUsersListForRoom = async (
  room,
  connectionID,
  domainName,
  stage
) => {
  console.log(`${connectionID} STARTED LIST USERS FOR ROOM ${room}`)
  client
    .query({
      TableName: playerTable,
      KeyConditionExpression: 'room = :room',
      ExpressionAttributeValues: { ':room': room },
    })
    .promise()
    .then((result) => {
      console.log(`${connectionID} LIST USERS 1`)
      // Gather the list of connect user's usernames
      const users = []
      result.Items.forEach((item) => {
        const numberWords =
          item.data && item.data.words ? item.data.words.length : 0
        users.push({ username: item.username, numberWords: numberWords })
      })
      console.log(`${connectionID} LIST USERS 2 -> ${users.length} users`)
      const msg = JSON.stringify({
        type: 'usersChanged',
        users: users,
      })

      // Send the usersChanged event to all connected users
      console.log(`${connectionID} LIST USERS 3 SENDING TO MOBILE: ${msg}`)
      result.Items.forEach((item) => {
        if (item.connectionID) {
          console.log(
            `${connectionID} SENDING TO USER: ${item.username} @ ${item.connectionID}`
          )
          WebSocket.send({
            domainName,
            stage,
            connectionID: item.connectionID,
            message: msg,
          }).catch((err) =>
            console.log(
              `${connectionID} LIST USERS ACK FAILED ${connectionID} ${domainName} ${stage}: ${err.toString()}`
            )
          )
        }
      })
    })
    .catch((err) => {
      console.log(`${connectionID} LIST USERS ERR SCAN! ${err.toString()}`)
    })
  console.log(`${connectionID} COMPLETED LIST USERS`)
}

export const getAllWords = async (connectionID, room, next) => {
  console.log(`STARTED GET WORDS FOR ROOM ${room}`)
  let allWords = []
  client
    .query({
      TableName: playerTable,
      KeyConditionExpression: 'room = :room',
      ExpressionAttributeValues: { ':room': room },
    })
    .promise()
    .then((result) => {
      const users = []
      result.Items.forEach((item) => {
        if (item.data && item.data.words) {
          console.log(`BEFORE ${item.username} WORDS WERE ${allWords}`)
          item.data.words.forEach((word) => {
            if (allWords.indexOf(word) === -1) allWords.push(word)
          })
          console.log(`AFTER ${item.username} WORDS ARE ${allWords}`)
        }
      })
      if (next) next(connectionID, allWords)
    })
    .catch((err) => {
      console.log(`LIST USERS ERR SCAN! ${err.toString()}`)
    })
}

export const StopPlayUser = (
  domainName,
  stage,
  username,
  room,
  remainingWords,
  adminConnectionID
) => {
  console.log(
    `STOP PLAY USER ${username} domain:${domainName} stage:${stage} connectionId:${adminConnectionID} WORDS: ${remainingWords} with `
  )
  const msg = JSON.stringify({
    type: 'stopPlayUser',
    username: username,
    remainingWords: remainingWords,
  })
  WebSocket.send({
    domainName,
    stage,
    connectionID: adminConnectionID,
    message: msg,
  })
}

export const playUser = async (
  connectionID,
  domainName,
  stage,
  room,
  username,
  allWords,
  next
) => {
  console.log(`STARTED PLAY USER v2 ${username}`)

  client

  return await client

    .query({
      TableName: playerTable,
      KeyConditionExpression: 'room = :room and username = :username',
      ExpressionAttributeValues: { ':room': room, ':username': username },
    })

    .promise()
    .then((result) => {
      console.log(`PLAY USER FOUND!`)
      const users = []
      result.Items.forEach((item) => {
        console.log(`PLAYING USER ${item.username} with words: ${allWords}`)
        const msg = JSON.stringify({
          type: 'play',
          words: allWords,
          adminConnectionID: connectionID,
        })
        WebSocket.send({
          domainName,
          stage,
          connectionID: item.connectionID,
          message: msg,
        })
      })
      if (next) next(connectionID, allWords)
    })
    .catch((err) => {
      console.log(`LIST USERS ERR SCAN! ${err.toString()}`)
    })
}
