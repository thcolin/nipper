import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import DynamicStatus from 'containers/DynamicStatus'
import LogoAnimated from 'containers/LogoAnimated'
import ButtonDownloadVideos from 'containers/ButtonDownloadVideos'
import styles from './styles'

var smoothScroll = require('smoothscroll')

const propsTypes = {
  sticked: PropTypes.bool
}

const defaultProps = {
  sticked: false
}

class Toolbar extends Component{
  render(){
    return(
      <section className="toolbar">
        <section className={css(styles.container)}>
          <DynamicStatus className={css(styles.element)} />
          {this.props.sticked &&
            <LogoAnimated color="red" className={css(styles.logo)} onClick={() => smoothScroll(document.querySelector('.landing'))} />
          }
          <ButtonDownloadVideos className={css(styles.element, styles.download)} />
        </section>
      </section>
    )
  }
}

Toolbar.propsTypes = propsTypes
Toolbar.defaultProps = defaultProps

export default Toolbar
