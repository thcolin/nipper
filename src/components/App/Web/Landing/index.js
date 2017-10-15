import React, { Component } from 'react'
import { css } from 'aphrodite'
import Parallax from './Parallax'
import LogoAnimated from 'containers/LogoAnimated'
import ButtonReset from 'containers/ButtonReset'
import Heading from './Heading'
import FormAnalyst from 'containers/FormAnalyst'
import styles from './styles'

class Landing extends Component{
  render(){
    return(
      <section id="landing" className={[this.props.className, css(styles.container)].join(' ')}>
        <Parallax />
        <div className={css(styles.subcontainer)}>
          <div className={css(styles.element, styles.headbar)}>
            <LogoAnimated className={css(styles.logo)} />
            <ButtonReset className={css(styles.element, styles.reset)} />
          </div>
          <div className={css(styles.element, styles.content)}>
            <Heading />
            <FormAnalyst />
          </div>
        </div>
      </section>
    )
  }
}

export default Landing
