import React from 'react'
import { AppContext } from '../contexts/AppContext'

export default function StateDisplay() {
  return (
    <AppContext.Consumer>
      {({ appState }) => {
        return (
          <div>
            <span>({appState})</span>
          </div>
        )
      }}
    </AppContext.Consumer>
  )
}
