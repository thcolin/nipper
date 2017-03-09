import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Parallax from './Parallax'
import Logo from './Logo'
import Heading from './Heading'
import AnalyzeForm from 'containers/AnalyzeForm'
import styles from './styles'

class Landing extends Component{
  render(){
    return(
      <section className={css(styles.global)}>
        <Parallax />
        <Logo />
        <Heading />
        <AnalyzeForm />
      </section>
    )
  }
}

export default Landing
