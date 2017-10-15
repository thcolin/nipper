import React, { Component } from 'react'
import { css } from 'aphrodite'
import styles from './styles'

class Heading extends Component{
  render(){
    return(
      <div className={css(styles.container)}>
        <h1 className={css(styles.title)}><span className={css(styles.backdrop)}>Victrola</span> Youtube playlist recorder</h1>
        <p className={css(styles.text)}>
          Parse Youtube <strong>video</strong> or <strong>playlist</strong> link,
          fix inaccurate tags (<strong>cover</strong>, <strong>artist</strong> & <strong>song</strong>),
          choose wanted format (<strong>mp4</strong>, <strong>webm</strong>, <strong>aac</strong>, <strong>mp3</strong> or <strong>ogg</strong>),
          and download <strong>on-by-one</strong> or <strong>zipped</strong> !
        </p>
      </div>
    )
  }
}

export default Heading