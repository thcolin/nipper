import React, { Component } from 'react'
import { css } from 'aphrodite'
import Landing from 'components/App/Web/Landing'
import ContentRetractable from 'containers/ContentRetractable'
import Toolbar from 'components/App/Web/Toolbar'
import Content from 'components/App/Web/Content'
import styles from './styles'

class Web extends Component{
  render(){
    return(
      <ContentRetractable className={css(styles.container)}>
        <Landing className={css(styles.floor)} />
        <section className={css(styles.floor)}>
          <Toolbar />
          <Content />
        </section>
      </ContentRetractable>
    )
  }
}

export default Web
