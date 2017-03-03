import React, { Component } from 'react'
import { css } from 'aphrodite'

import Snippet from 'Video/Snippet/Snippet'
import About from 'Video/About/About'
import Description from 'Video/Description/Description'
import Actions from 'Video/Actions/Actions'

import styles from './Video.styles'

class Video extends Component{
  render(){
    return(
      <article className={css(styles.global)}>
        <Snippet className={css(styles.element, styles.firstElement)} />
        <About className={css(styles.element)} />
        <Description className={css(styles.element)}>@description</Description>
        <Actions className={css(styles.element, styles.lastElement)} />
      </article>
    )
  }
}

export default Video
