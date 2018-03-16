import React, { Component } from 'react'
import { css } from 'aphrodite'
import Parallax from './Parallax'
import LogoAnimatable from 'containers/LogoAnimatable'
import ButtonClear from 'containers/ButtonClear'
import Heading from './Heading'
import FormAnalysis from 'containers/FormAnalysis'
import styles from './styles'

class Landing extends Component{
  render(){
    return(
      <section id="landing" className={[this.props.className, css(styles.container)].join(' ')}>
        <Parallax />
        <div className={css(styles.subcontainer)}>
          <div className={css(styles.element, styles.headbar)}>
            <LogoAnimatable className={css(styles.logo)} />
            <div className={css(styles.buttons)}>
              <ButtonClear className={css(styles.element, styles.button)} />
            </div>
          </div>
          <div className={css(styles.element, styles.content)}>
            <Heading />
            <FormAnalysis className={css(styles.element, styles.form)} />
          </div>
        </div>
      </section>
    )
  }
}

export default Landing
