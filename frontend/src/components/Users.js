import React from 'react'
import { AppContext } from '../contexts/AppContext'

import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import PersonIcon from '@material-ui/icons/Person'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded'

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: theme.palette.background.paper,
  },
  playIcon: {
    cursor: 'pointer',
  },
}))

export default function Users() {
  const classes = useStyles()

  return (
    <AppContext.Consumer>
      {({ users, admin, playUser }) => {
        return (
          <Card>
            {true ? (
              <CardContent>
                <List className={classes.root}>
                  {users
                    .filter((user) => user.username !== 'Admin')
                    .map((user) => (
                      <ListItem key={user.username}>
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={user.numberWords}
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
