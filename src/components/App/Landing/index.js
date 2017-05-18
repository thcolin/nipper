import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Parallax from './Parallax'
import LogoAnimated from 'containers/LogoAnimated'
import Heading from './Heading'
import FormAnalyst from 'containers/FormAnalyst'
import styles from './styles'

class Landing extends Component{
  render(){
    return(
      <section className={[css(styles.container), 'landing'].join(' ')}>
        <Parallax className={css(styles.element)} />
        <LogoAnimated className={css(styles.element, styles.logo)} />
        <div className={css(styles.element, styles.content)}>
          <Heading />
          <FormAnalyst />
        </div>
      </section>
    )
  }
}

export default Landing
