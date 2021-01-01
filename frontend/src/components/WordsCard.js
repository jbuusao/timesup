import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { AppContext } from '../contexts/AppContext'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 600,
    marginTop: 20,
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
    marginTop: 20,
  },
})

const WordsCard = () => {
  const classes = useStyles()

  const [words, setWords] = useState([])
  const [word, setWord] = useState('')

  let textInput = null
  useEffect(() => {
    textInput.focus()
  })

  const doAdd = () => {
    if (word && word.length) {
      let w = words.filter((w) => w !== word)
      w.push(word)
      setWords(w)
    }
    setWord('')
  }

  const doRemove = (toRemove) => {
    let w = words.filter((name) => name !== toRemove)
    setWords(w)
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
                Enter words (ADD) and then (SUBMIT)
              </Typography>
              <input
                type='text'
                value={word}
                onSubmit={(e) => doAdd()}
                onChange={(e) => setWord(e.target.value.trim())}
                ref={(item) => {
                  textInput = item
                }}
              />
              <Button
                startIcon={<AddIcon />}
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
                    <ListItemText primary={word} secondary='' />
                    <ListItemIcon
                      onClick={() => doRemove(word)}
                      className={classes.trash}
                    >
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

export default WordsCard
