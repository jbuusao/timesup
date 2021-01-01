import React from 'react'
import { Button, Typography } from '@material-ui/core'
import { AppContext } from '../contexts/AppContext'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import SkipNextIcon from '@material-ui/icons/SkipNext'

const useStyles = makeStyles({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  card: {
    background: 'lightblue',
  },
  textField: {
    margin: '0 2px',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trash: {
    cursor: 'pointer',
  },
  pos: {
    // marginTop: 12,
    marginBottom: 12,
  },
})

export default function GuessCard() {
  const classes = useStyles()

  return (
    <AppContext.Consumer>
      {({ admin, timer, stopPlay, wordToGuess, skipWord }) => {
        if (timer < 0) {
          stopPlay()
        }
        return (
          <div className={classes.root}>
            {timer > 0 ? (
              <Card className={classes.card}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color='textSecondary'
                    gutterBottom
                  >
                    {wordToGuess}
                  </Typography>{' '}
                  <Typography
                    className={classes.timer}
                    color='textSecondary'
                    gutterBottom
                  >
                    {timer}s
                  </Typography>{' '}
                </CardContent>
                <CardActions>
                  <Button
                    startIcon={<SkipNextIcon />}
                    color='primary'
                    onClick={() => skipWord()}
                  >
                    Next word
                  </Button>
                </CardActions>
              </Card>
            ) : null}
          </div>
        )
      }}
    </AppContext.Consumer>
  )
}
