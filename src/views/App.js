import React, { Component } from 'react'
import { StyleSheet, css } from 'aphrodite'
import WrapperRetractable from 'containers/WrapperRetractable'
import Landing from 'layout/Landing'
import Toolbar from 'layout/Toolbar'
import Corpus from 'layout/Corpus'

require('normalize.css')
require('resources/fonts/typeface-open-sans.css')
require('resources/fonts/typeface-titillium-web.css')

const styles = StyleSheet.create({
  wrapper: {
    fontFamily: "'Titillium Web', sans-serif",
    fontSize: '14px',
    lineHeight: 1.42857143,
    color: '#333'
  },
  section: {
    display: 'flex',
    flexDirection: 'column'
  }
})

class App extends Component{
  render(){
    return(
      <WrapperRetractable className={css(styles.wrapper)}>
        <Landing className={css(styles.section)} />
        <section className={css(styles.section)}>
          <Toolbar />
          <Corpus />
        </section>
      </WrapperRetractable>
    )
  }
}

export default App
