import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import DeleteIcon from '@material-ui/icons/Delete'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Avatar from '@material-ui/core/Avatar'
import PersonIcon from '@material-ui/icons/Person'
import { AppContext } from '../contexts/AppContext'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 600,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  trash: {
    cursor: 'pointer',
  },
  pos: {
    marginBottom: 12,
  },
})

export default function GetWordCard() {
  const classes = useStyles()

  return (
    <AppContext.Consumer>
      {({ getRandomWords, randomWords }) => {
        return (
          <Card className={classes.root}>
            <CardContent>
              <p />
              <p />
              <List className={classes.root}>
                {randomWords.map((word) => (
                  <ListItem key={word}>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={word} secondary='' />
                    <ListItemIcon className={classes.trash}>
                      <DeleteIcon />
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )
      }}
    </AppContext.Consumer>
  )
}
