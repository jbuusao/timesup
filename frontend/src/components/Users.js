import React from 'react'
import { AppContext } from '../contexts/AppContext'

import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1'
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  playIcon: {
    cursor: 'pointer',
  },
}))

export default function Users() {
  const classes = useStyles()

  return (
    <AppContext.Consumer>
      {({ playing, username, users, admin, playUser, foundWord }) => {
        return (
          <Card>
            {true ? (
              <CardContent>
                <List dense className={classes.root}>
                  {users
                    .filter((user) => user.username.toLowerCase() !== 'admin')
                    .sort((user1, user2) =>
                      user1.points > user2.points ? -1 : 1
                    )
                    .map((user) => (
                      <ListItem key={user.username}>
                        <ListItemAvatar
                          cursor='pointer'
                          onClick={() => {
                            if (playing && user.username !== username)
                              foundWord(user.username)
                          }}
                        >
                          <Avatar cursor='pointer'>
                            {!playing || username === user.username ? null : (
                              <ExposurePlus1Icon />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={
                            admin
                              ? `${user.points} (${user.numberWords})`
                              : username === user.username
                              ? `${user.points} (${user.numberWords})`
                              : user.points
                          }
                        />
                        {admin ? (
                          <ListItemIcon
                            className={classes.playIcon}
                            onClick={() => playUser(user)}
                          >
                            <PlayArrowRoundedIcon />
                          </ListItemIcon>
                        ) : null}
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            ) : null}
          </Card>
        )
      }}
    </AppContext.Consumer>
  )
}
