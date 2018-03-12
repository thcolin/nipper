import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import DynamicStatus from 'containers/DynamicStatus'
import LogoAnimated from 'containers/LogoAnimated'
import SelectFormat from 'containers/SelectFormat'
import ButtonDownload from 'containers/ButtonDownload'
import styles from './styles'

class Toolbar extends Component{
  render(){
    return(
      <section className={css(styles.container)}>
        <DynamicStatus className={css(styles.element)} />
          <LogoAnimated color="red" className={css(styles.logo)} onClick={() =>
            window.scroll({
              top: 0,
              left: 0,
              behavior: 'smooth'
            })
          } />
        <div className={css(styles.buttons)}>
          <SelectFormat />
          <ButtonDownload className={css(styles.element, styles.download)} />
        </div>
      </section>
    )
  }
}

export default Toolbar
