import React, { Component } from 'react'
import { css } from 'aphrodite'

import styles from './Logo.styles'

class Logo extends Component{
  render(){
    return(
      <div className={css(styles.global)}>
        <img src="assets/img/logo.png" alt="Logo" className={css(styles.image)} />
      </div>
    )
  }
}

export default Logo
