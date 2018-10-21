import React from 'react'
import { hot } from 'react-hot-loader'
import { css } from 'glamor'
import Landing from 'views/sections/Landing'
import Toolbar from 'views/sections/Toolbar'
import Body from 'views/sections/Body'
import WrapperOngoing from 'views/wrappers/WrapperOngoing'

const suitup = (props = {}, state = {}) => ({
  element: css({
    display: 'flex',
    flexDirection: 'column'
  }),
  wrapper: css({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  })
})

const App = (props) => {
  const classes = suitup(props)

  return (
    <div className={classes.element}>
      <Landing />
      <WrapperOngoing>
        {({ ongoing, empty, done }) => ongoing && (
          <div className={empty ? classes.wrapper : ''}>
            <Toolbar done={done} />
            <Body empty={empty} done={done} />
          </div>
        )}
      </WrapperOngoing>
    </div>
  )
}

export default hot(module)(App)
