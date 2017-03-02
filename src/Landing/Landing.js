import React, { Component } from 'react'
import { css } from 'aphrodite'

import Parallax from 'Landing/Parallax/Parallax'
import Logo from 'Landing/Logo/Logo'
import Heading from 'Landing/Heading/Heading'
import Search from 'Landing/Search/Search'

import styles from 'Landing/Landing.styles'

class Landing extends Component{
  render(){
    return(
      <section className={css(styles.global)}>
        <Parallax />
        <Logo />
        <Heading />
        <Search />
      </section>
    )
  }
}

export default Landing
