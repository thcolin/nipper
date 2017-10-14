import React, { Component } from 'react'
import { css } from 'aphrodite'
import Landing from 'components/App/Web/Landing'
import ContentHideable from 'containers/ContentHideable'
import Toolbar from 'components/App/Web/Toolbar'
import Content from 'components/App/Web/Content'
import styles from './styles'

class Web extends Component{
  render(){
    return(
      <div className={css(styles.container)}>
        <Landing />
        <ContentHideable className={css(styles.content)}>
          <Toolbar />
          <Content />
        </ContentHideable>
      </div>
    )
  }
}

export default Web
