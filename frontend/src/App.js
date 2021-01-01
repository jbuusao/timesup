import React from 'react'
import { AppContext, AppState } from './contexts/AppContext'
import { withStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { ThemeProvider } from '@material-ui/core/styles'

import './App.css'
import Login from './components/Login'
import Users from './components/Users'
import WordsCard from './components/WordsCard'
import GuessCard from './components/GuessCard'

const serverAPI = 'wss://odkdv001gb.execute-api.us-east-1.amazonaws.com/dev'
const timerValueSeconds = 30

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: null,
      timerID: 0,
      timer: 0,
      allWords: [],
      remainingWords: [],
      usersPlayed: [],
      wordsSubmitted: false,
      wordToGuess: null,
      wordsTried: [],
      wordToGuessIndex: 0,
      adminConnectionID: 0,
      playing: false,
      appState: AppState.AWAIT_PLAYERS,
      room: '',
      username: '',
      admin: false,
      users: [],
      usersRound: [],
      randomWords: [],
      socket: null,
    }
  }

  doPlayUser = (user) => {
    this.sendToServer({
      playUser: user.username,
      from: this.state.username,
      room: this.state.room,
      allWords: this.state.remainingWords,
    })
  }

  doStopPlay = () => {
    // console.log(`Cleared timer ${this.state.timerID}`)
    if (this.state.timerID) {
      clearInterval(this.state.timerID)
      const remainingWords = this.state.allWords.slice(
        this.state.wordToGuessIndex + 1
      )
      // console.log(`Remaining words ${remainingWords}`)
      this.setState({ timerID: 0, playing: false })
      this.sendToServer({
        stopPlayUser: this.state.username,
        room: this.state.room,
        remainingWords: remainingWords,
        adminConnectionID: this.state.adminConnectionID,
      })
    }
  }

  doSkipWord = () => {
    let i = this.state.wordToGuessIndex + 1
    if (i >= this.state.allWords.length) i = 0
    this.setState({ wordToGuess: this.state.allWords[i], wordToGuessIndex: i })
  }

  // Admin asked to start a new round
  doStart = () => {
    this.setState({
      usersRound: this.state.users,
      remainingWords: this.state.allWords,
    })
    this.sendToServer({
      from: this.state.username,
      getRandomWords: true,
      room: this.state.room,
    })
  }

  // Admin asked to restart a game
  doRestart = () => {
    this.sendToServer({
      newGame: true,
      room: this.state.room,
    })
    // this.setState({ remainingWords: this.state.randomWords })
    // this.getRandomWords()
  }

  shuffle = (array) => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }

  // We must play
  handlePlay = (words, adminConnectionID) => {
    const shuffled = this.shuffle(words)
    this.setState({ alert: shuffled, timer: timerValueSeconds })
    if (this.state.timerID === 0) {
      const timerId = setInterval(() => {
        this.setState({ timer: this.state.timer - 1 })
      }, 1000)
      const guess = shuffled[0]
      console.log(`Set timer ${timerId} for ${shuffled}`)
      this.setState({
        playing: true,
        timerID: timerId,
        adminConnectionID: adminConnectionID,
        allWords: shuffled,
        wordToGuessIndex: 0,
        wordToGuess: guess,
      })
    }
  }

  handleStopPlayUser = (username, words) => {
    const played = this.state.usersPlayed.filter((name) => name !== username)
    played.push(username)
    console.log(played)
    this.setState({
      remainingWords: words,
      usersPlayed: played,
    })
  }

  // Users have changed
  handleUserChanged = (users) => {
    // Determine if all users have entered their lists of words
    if (
      this.state.appState === AppState.AWAIT_PLAYERS ||
      this.state.appState === AppState.AWAIT_WORDS
    ) {
      const awaiting = users.filter((user) => user.numberWords === 0)
      this.setState({
        appState: awaiting.length ? AppState.AWAIT_WORDS : AppState.ROUND1,
      })
    }
    const me = users.find((user) => user.username === this.state.username)
    const hasWords = me.numberWords !== 0
    this.setState({
      users: users.sort((user1, user2) =>
        user1.points > user2.points ? -1 : 1
      ),
      wordsSubmitted: hasWords,
    })
  }

  getRandomWords = () => {
    this.sendToServer({
      from: this.state.username,
      getRandomWords: true,
      room: this.state.room,
    })
  }

  // The user wants to suibmit her list of words
  doSubmitWords = (words) => {
    this.sendToServer({
      from: this.state.username,
      room: this.state.room,
      words: words,
    })
    this.setState({ wordsSubmitted: true })
  }

  // Whilst playing, the player signals that user has found a word
  doFoundWord = (user) => {
    this.sendToServer({
      from: this.state.username,
      room: this.state.room,
      foundWord: user,
    })
    // Add some time to compensate for the time it took to click
    this.setState({ timer: this.state.timer + 4 })
  }

  openConnection = () => {
    if (this.state.socket) this.state.socket.close()
    const ws = new WebSocket(serverAPI)
    this.setState({ socket: ws })

    ws.onmessage = (e) => {
      try {
        try {
          const data = JSON.parse(e.data)
          if (data.type && data.type === 'usersChanged')
            this.handleUserChanged(data.users)
          else if (data.type && data.type === 'randomWords')
            this.setState({ randomWords: data.data, remainingWords: data.data })
          else if (data.type === 'play') {
            this.handlePlay(data.words, data.adminConnectionID)
          } else if (data.type === 'stopPlayUser') {
            this.handleStopPlayUser(data.username, data.remainingWords)
          }
        } catch (err) {
          console.log('Parsing error: ' + err)
        }
      } catch (error) {
        console.log('Received from AWS' + e.data)
        console.log('Error: ' + error.toString())
      }
    }
  }

  componentDidMount() {
    this.openConnection()
  }

  // Connect to the server as "username"
  doConnectToServer = (room, name) => {
    // this.openConnection()
    this.sendToServer({ connect: name, room: room })
    this.setState({
      room: room,
      username: name,
      admin: name.toLowerCase() === 'admin',
    })
    // Alert.alert(`Connected as ${name}...`)
  }

  sendToServer = (data) => {
    if (this.state.socket)
      this.state.socket.send(
        JSON.stringify({ action: 'message', message: data })
      )
  }

  render() {
    const { classes } = this.props
    return (
      <AppContext.Provider
        value={{
          // Read only access to state
          username: this.state.username,
          users: this.state.users,
          appState: this.state.appState,
          playing: this.state.playing,
          timer: this.state.timer,
          wordsSubmitted: this.state.wordsSubmitted,
          admin: this.state.admin,
          randomWords: this.state.randomWords,
          remainingWords: this.state.remainingWords,
          wordToGuess: this.state.wordToGuess,
          alert: this.state.alert,
          // Actions
          connectToServer: this.doConnectToServer,
          submitWords: this.doSubmitWords,
          playUser: this.doPlayUser,
          start: this.doStart,
          restart: this.doRestart,
          foundWord: this.doFoundWord,
          stopPlay: this.doStopPlay,
          skipWord: this.doSkipWord,
        }}
      >
        <ThemeProvider>
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item>
                  <Login />
                </Grid>
                <Grid item>
                  <GuessCard />
                </Grid>
                <Grid item>
                  <Users />
                </Grid>
                {!this.state.admin &&
                this.state.username &&
                !this.state.wordsSubmitted ? (
                  <Grid item>
                    <WordsCard />
                  </Grid>
                ) : null}
                {/* <Grid item>
                  <GetWordCard />
                </Grid> */}
              </Grid>
            </Paper>
          </div>
        </ThemeProvider>
      </AppContext.Provider>
    )
  }
}

const styles = (theme) => ({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    flexGrow: 1,
  },
  paper: {
    // padding: theme.spacing(2),
    margin: 'auto',
    padding: '10px 30px',
    maxWidth: 500,
  },
})

export default withStyles(styles)(App)
