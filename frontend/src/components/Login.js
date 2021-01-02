import React, { useState } from 'react'
import { Button, TextField, Typography } from '@material-ui/core'
import ConnectIcon from '@material-ui/icons/PersonAdd'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite'
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
      {({ connectToServer, start, restart, admin, playing }) => {
        return (
          <div className={classes.root}>
            {!playing ? (
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
                      startIcon={<PlayCircleFilledWhiteIcon />}
                      color='secondary'
                      onClick={() => start()}
                    >
                      New round
                    </Button>
                  ) : null}
                  {admin ? (
                    <Button
                      startIcon={<RotateLeftIcon />}
                      color='secondary'
                      onClick={() => restart()}
                    >
                      New game
                    </Button>
                  ) : null}
                  {/* {admin ? (
                  <Typography>{remainingWords.toString()}</Typography>
                ) : null} */}
                </CardActions>
              </Card>
            ) : null}
          </div>
        )
      }}
    </AppContext.Consumer>
  )
}
