import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import DynamicStatus from 'containers/DynamicStatus'
import LogoAnimated from 'containers/LogoAnimated'
import SelectFormat from 'containers/SelectFormat'
import ButtonDownload from 'containers/ButtonDownload'
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
          <div className={css(styles.buttons)}>
            <SelectFormat />
            <ButtonDownload className={css(styles.element, styles.download)} />
          </div>
        </section>
      </section>
    )
  }
}

Toolbar.propsTypes = propsTypes
Toolbar.defaultProps = defaultProps

export default Toolbar
