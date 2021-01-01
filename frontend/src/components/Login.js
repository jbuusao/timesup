import React, { useState } from 'react'
import { Button, TextField, Typography } from '@material-ui/core'
import ConnectIcon from '@material-ui/icons/PersonAdd'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded'
import { AppContext } from '../contexts/AppContext'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'

const useStyles = makeStyles({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  textField: {
    margin: '0 2px',
  },
  title: {
    fontSize: 14,
  },
  trash: {
    cursor: 'pointer',
  },
  pos: {
    // marginTop: 12,
    marginBottom: 12,
  },
})

export default function Login() {
  const classes = useStyles()
  const [room, setRoom] = useState('')
  const [name, setName] = useState('')

  return (
    <AppContext.Consumer>
      {({ connectToServer, play, restart, admin, remainingWords, alert }) => {
        return (
          <div className={classes.root}>
            <Card>
              <CardContent>
                <TextField
                  className={classes.textField}
                  color='primary'
                  type='string'
                  value={room}
                  placeholder='Room'
                  onChange={(e) => {
                    setRoom(e.target.value)
                  }}
                />
                <TextField
                  className={classes.textField}
                  color='primary'
                  type='string'
                  value={name}
                  placeholder='Username'
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<ConnectIcon />}
                  color='primary'
                  onClick={() => connectToServer(room, name)}
                />
                {admin ? (
                  <Button
                    startIcon={<PlayArrowRoundedIcon />}
                    color='secondary'
                    onClick={() => play(1)}
                  >
                    1
                  </Button>
                ) : null}
                {admin ? (
                  <Button
                    startIcon={<PlayArrowRoundedIcon />}
                    color='secondary'
                    onClick={() => play(2)}
                  >
                    2
                  </Button>
                ) : null}
                {admin ? (
                  <Button
                    startIcon={<PlayArrowRoundedIcon />}
                    color='secondary'
                    onClick={() => play(3)}
                  >
                    3
                  </Button>
                ) : null}
                {admin ? (
                  <Button
                    startIcon={<RotateLeftIcon />}
                    color='secondary'
                    onClick={() => restart()}
                  >
                    Restart
                  </Button>
                ) : null}
                {admin ? (
                  <Typography value='cool'>
                    {remainingWords.toString()}
                  </Typography>
                ) : null}
              </CardActions>
            </Card>
          </div>
        )
      }}
    </AppContext.Consumer>
  )
}
