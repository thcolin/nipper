import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import StatusComponent from 'containers/StatusComponent'
import LoadingLogo from 'containers/LoadingLogo'
import DownloadSelectionButton from 'containers/DownloadSelectionButton'
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
          <StatusComponent className={css(styles.element)} />
          {this.props.sticked &&
            <LoadingLogo color="red" className={css(styles.logo)} onClick={() => smoothScroll(document.querySelector('.landing'))} />
          }
          <DownloadSelectionButton className={css(styles.element, styles.download)} />
        </section>
      </section>
    )
  }
}

Toolbar.propsTypes = propsTypes
Toolbar.defaultProps = defaultProps

export default Toolbar
