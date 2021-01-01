const AWS = require('aws-sdk')
const { uuid } = require('uuidv4')

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
})

const client = new AWS.DynamoDB.DocumentClient()

const playerTable = 'timesup_players'
const sessionTable = 'timesup_sessions'
const completedGamesTable = 'timesup_completed_games'
const sessionIndex = 'timesup_username_index'
const activeGamesTable = 'timesup_active_games'

const Dynamo = {
  async getSessionForConnection(connectionID, TableName) {
    console.log(`DEBUG getSessionForConnection(${connectionID}, ${TableName})`)

    var params = {
      TableName: TableName,
      Key: {
        connectionID: connectionID,
      },
    }
    const data = await client.get(params).promise()

    if (!data || !data.Item) {
      console.log(`DEBUG not found`)
      throw Error(
        `There was an error fetching the data for ID of ${connectionID} from ${TableName}`
      )
    }
    // console.log(`DEBUG found ${data.Item.connectionID}`);

    return data.Item
  },

  /*
   * Creates the completed game associated to the given session, and returns the ID of the created game
   */
  createCompletedGame(session, pgn) {
    const ID = uuid()
    console.log('ABOUT TO CREATE GAME FOR PGN : ' + pgn)
    client
      .put({ TableName: completedGamesTable, Item: { ID, pgn } })
      .promise()
      .then((result) => {
        return ID
      })
      .catch((err) => {
        console.log('ERROR: ' + err)
      })
  },

  /*
   * Creates the active game associated to the given session, and returns the ID of the created game
   */
  createActiveGame(session) {
    const ID = uuid()
    client
      .put({ TableName: activeGamesTable, Item: { ID, session } })
      .promise()
      .then((result) => {
        return ID
      })
      .catch((err) => {
        return null
      })
  },

  /*
   *  Run the given process on the list of sessions
   */
  async processSession(TableName, process) {
    client.scan(
      { TableName: TableName, IndexName: 'timesup_username_index' },
      (err, data) => {
        if (err) {
          console.log(`DEBUG error:${err.message}`)
        } else if (data && data.Items) {
          data.Items.forEach((session) => sessions.push(session))
          process(sessions)
        }
      }
    )
  },

  // Provides the list of connected users
  async listUsers(connectionID, domainName, stage, next) {
    // console.log(`${connectionID} STARTED LIST USERS`);
    client
      .scan({ TableName: sessionTable, IndexName: sessionIndex })
      .promise()
      .then((result) => {
        // console.log(`${connectionID} LIST USERS 1`);
        const users = []
        result.Items.forEach((item) => users.push(item.username))
        // console.log(`${connectionID} LIST USERS 2 invokes NEXT`);
        next(users)
      })
      .catch((err) => {
        console.log(`${connectionID} LIST USERS ERR SCAN`)
      })
    // console.log(`${connectionID} COMPLETED LIST USERS`);
  },

  // Return the connectionID for a given user
  async getConnectionID(username) {
    return await client
      .query({
        TableName: sessionTable,
        IndexName: sessionIndex,
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: { ':username': username },
      })
      .promise()
  },

  async createPlayer(connectionID, room, username, newData, next) {
    console.log(
      `${connectionID} CREATE/UPDATE PLAYER 1 room:${room} username:${username}`
    )
    client
      .put({
        TableName: playerTable,
        Item: {
          room: room,
          username: username,
          connectionID: connectionID,
          data: newData,
        },
      })
      .promise()
      .then(() => {
        console.log(`${connectionID} CREATED PLAYER, (call next)`)
        if (next) next()
      })
      .catch((err) => {
        console.log(`${connectionID} CREATE PLAYER ERR ${err}`)
      })
  },

  async get(connectionID, TableName) {
    const params = {
      TableName,
      Key: {
        connectionID,
      },
    }

    const data = await client.get(params).promise()

    if (!data || !data.Item) {
      throw Error(
        `There was an error fetching the data for ID of ${connectionID} from ${TableName}`
      )
    }
    console.log(data)

    return data.Item
  },

  async write(data, TableName) {
    if (!data.connectionID) {
      throw Error('no ID on the data')
    }

    const params = {
      TableName,
      Item: data,
    }

    const res = await client.put(params).promise()

    if (!res) {
      throw Error(
        `There was an error inserting ID of ${data.connectionID} in table ${TableName}`
      )
    }

    return data
  },

  async delete(connectionID, TableName) {
    const params = {
      TableName,
      Key: {
        connectionID,
      },
    }

    return client.delete(params).promise()
  },
}
module.exports = Dynamo
