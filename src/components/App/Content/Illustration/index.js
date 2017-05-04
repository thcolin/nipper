import React, { Component } from 'react'
import { css } from 'aphrodite'
import styles from './styles'

class Illustration extends Component{
  render(){
    return (
      <div className={css(styles.container)}>
        <img src="resources/illustration.svg" alt="Empty illustration" className={css(styles.image)} />
        <h1 className={css(styles.title)}>Oops, no videos was found</h1>
        <p className={css(styles.subtext)}>Something went wrong, submitted link seems to be valid, but the service didn't find any video available for conversion, playlist may be empty or the video may be unavailable in the service's country</p>
      </div>
    )
  }
}

export default Illustration
