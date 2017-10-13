import React, { Component } from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import { css } from 'aphrodite'
import Landing from 'components/App/Web/Landing'
import ContentHideable from 'containers/ContentHideable'
import Toolbar from 'components/App/Web/Toolbar'
import Content from 'components/App/Web/Content'
import styles from './styles'

class Web extends Component{
  constructor(props){
    super(props)
    this.state = {
      sticked: false
    }

    this.handleSticky = this.handleSticky.bind(this)
  }

  handleSticky(e){
    this.setState({sticked: !this.state.sticked})
  }

  render(){
    return(
      <div className={css(styles.container)}>
        <Landing />
        <ContentHideable>
          <StickyContainer>
            <Sticky stickyStyle={{zIndex: 2}} onStickyStateChange={this.handleSticky}>
              <Toolbar sticked={this.state.sticked} />
            </Sticky>
            <Content />
          </StickyContainer>
        </ContentHideable>
      </div>
    )
  }
}

export default Web
