import React, { Component } from 'react'
import { css } from 'aphrodite'

import styles from './Parallax.styles'

class Parallax extends Component{
  render(){
    return(
      <div className={css(styles.global)}>
        <img src="assets/img/picture.jpg" alt="Parallax picture" className={css(styles.image)} />
      </div>
    )
  }
}

export default Parallax
