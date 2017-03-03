import React, { Component } from 'react'
import { css } from 'aphrodite'

import Landing from 'Landing/Landing'
import Toolbar from 'Toolbar/Toolbar'
import Container from 'Container/Container'

import styles from './App.styles'

class App extends Component{
  render(){
    return(
      <div className={css(styles.global)}>
        <Landing />
        <Toolbar />
        <Container />
      </div>
    )
  }
}

export default App
