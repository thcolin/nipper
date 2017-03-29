import React, { Component } from 'react'
import { css } from 'aphrodite'
import styles from './styles'

class Heading extends Component{
  render(){
    return(
      <div className={css(styles.container)}>
        <h1 className={css(styles.title)}>Smoothly download Youtube playlist</h1>
        <p className={css(styles.text)}>Grabs videos from any Youtube playlist, extracts audio as MP3 with a 192kbps bitrate and preseted ID3 tags (cover, song and artist), then send you all of it in a ZIP archive !</p>
      </div>
    )
  }
}

export default Heading
