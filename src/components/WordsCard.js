import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
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

export default function WordsCard() {
  const classes = useStyles()

  const [words, setWords] = useState([])
  const [word, setWord] = useState('')

  const doAdd = () => {
    let w = words
    w.push(word)
    setWords(w)
    setWord('')
  }

  return (
    <AppContext.Consumer>
      {({ submitWords, wordsSubmitted }) => {
        return (
          <Card className={classes.root}>
            <CardContent>
              <Typography
                className={classes.title}
                color='textSecondary'
                gutterBottom
              >
                Enter a word
              </Typography>
              <TextField
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
              <Button
                startIcon={<AddIcon />}
                variant='contained'
                color='primary'
                onClick={() => doAdd()}
              >
                Add
              </Button>

              <p />
              <p />
              <List className={classes.root}>
                {words.map((word) => (
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
            <CardActions>
              <Button size='small' onClick={() => submitWords(words)}>
                Submit
              </Button>
            </CardActions>
          </Card>
        )
      }}
    </AppContext.Consumer>
  )
}
