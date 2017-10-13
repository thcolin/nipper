import React, { Component } from 'react'
import { css } from 'aphrodite'
import styles from './styles'

class Heading extends Component{
  render(){
    return(
      <div className={css(styles.container)}>
        <h1 className={css(styles.title)}><span className={css(styles.backdrop)}>Victrola</span> Youtube playlist recorder</h1>
        <p className={css(styles.text)}>
          Parse Youtube <b>video</b> or <b>playlist</b> link,
          fix inaccurate tags (<b>cover</b>, <b>artist</b> & <b>song</b>),
          choose wanted format (<b>mp4</b>, <b>webm</b>, <b>aac</b>, <b>mp3</b> or <b>ogg</b>),
          and download <b>on-by-one</b> or <b>zipped</b> !
        </p>
      </div>
    )
  }
}

export default Heading
