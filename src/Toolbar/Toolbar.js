import React, { Component } from 'react'
import { css } from 'aphrodite'

import Toggle from 'Shared/Toggle'
import Button from 'Shared/Button'

import styles from './Toolbar.styles'

class Toolbar extends Component{
  render(){
    return(
      <section className={css(styles.global)}>
        <Toggle className={css(styles.element)} />
        {false ?
          <p className={css(styles.element, styles.text)}>You need to select at least one video to download a selection</p>
          :
          <p className={css(styles.element, styles.text)}>You're about to convert and download <strong>10</strong> videos</p>
        }
        <Button className={css(styles.element)}>Download Selection</Button>
      </section>
    )
  }
}

export default Toolbar
