import React, { Component } from 'react'
import { css } from 'aphrodite'
import Illustration from 'resources/illustration.svg'
import styles from './styles'

class Placeholder extends Component{
  render(){
    return (
      <div className={css(styles.container)}>
        <Illustration />
        <h1 className={css(styles.title)}>Oops, no videos was found</h1>
        <p className={css(styles.subtext)}>Something went wrong, the service didn't find any video available for process,<br/>playlist may be empty or the video may have restrictions</p>
      </div>
    )
  }
}

export default Placeholder
