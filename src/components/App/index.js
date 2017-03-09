import React, { Component } from 'react'
import { css } from 'aphrodite'
import Landing from 'components/App/Landing'
import Toolbar from 'components/App/Toolbar'
import Repository from 'components/App/Repository'
import Video from 'components/App/Video'
import styles from './styles'

class App extends Component{
  render(){
    return(
      <div className={css(styles.global)}>
        <Landing />
        <div>
          <Toolbar />
          <Repository />
        </div>
      </div>
    )
  }
}

export default App
