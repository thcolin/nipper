import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import SelectionToggle from 'containers/SelectionToggle'
import SelectionText from 'containers/SelectionText'
import DownloadSelectionButton from 'containers/DownloadSelectionButton'
import styles from './styles'

class Toolbar extends Component{
  render(){
    return(
      <section className={css(styles.global)}>
        <SelectionToggle className={css(styles.element)} />
        <SelectionText className={css(styles.element, styles.text)} />
        <DownloadSelectionButton className={css(styles.element)} />
      </section>
    )
  }
}

export default Toolbar
