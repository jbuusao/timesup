import React from 'react'
import { AppContext } from '../contexts/AppContext'

export default function Header() {
  return (
    <AppContext.Consumer>
      {({ username }) => {
        return username ? (
          <div>
            <span>Hello {username}</span>
          </div>
        ) : null
      }}
    </AppContext.Consumer>
  )
}
