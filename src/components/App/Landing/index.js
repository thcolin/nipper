import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Parallax from './Parallax'
import Logo from 'components/Shared/Logo'
import Heading from './Heading'
import AnalyzeForm from 'containers/AnalyzeForm'
import styles from './styles'

class Landing extends Component{
  render(){
    return(
      <section className={[css(styles.container), 'landing'].join(' ')}>
        <Parallax />
        <Logo className={css(styles.logo)} />
        <Heading />
        <AnalyzeForm />
      </section>
    )
  }
}

export default Landing
