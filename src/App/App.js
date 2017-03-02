import React, { Component } from 'react'
import { css } from 'aphrodite'

import Landing from 'Landing/Landing'

import styles from 'App/App.styles'

class App extends Component{
  render(){
    return(
      <div className={css(styles.global)}>
        <Landing />
      </div>
    )
  }
}

export default App
