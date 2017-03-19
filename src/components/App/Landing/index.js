import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Parallax from './Parallax'
import LoadingLogo from 'containers/LoadingLogo'
import Heading from './Heading'
import AnalyzeForm from 'containers/AnalyzeForm'
import styles from './styles'

class Landing extends Component{
  render(){
    return(
      <section className={[css(styles.container), 'landing'].join(' ')}>
        <Parallax className={css(styles.element)} />
        <LoadingLogo className={css(styles.element, styles.logo)} />
        <div className={css(styles.element, styles.content)}>
          <Heading />
          <AnalyzeForm />
        </div>
      </section>
    )
  }
}

export default Landing
