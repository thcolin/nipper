import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Toggle from 'components/Shared/Toggle'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  empty: PropTypes.bool.isRequired,
  toggled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  downloading: PropTypes.bool.isRequired,
  onDownload: PropTypes.func.isRequired
}

class Toolbar extends Component{
  render(){
    return(
      <section className={css(styles.global)}>
        <Toggle
          className={css(styles.element)}
          toggled={this.props.toggled}
          onToggle={this.props.onToggle}
          disabled={this.props.empty || this.props.downloading}
        />
        {this.props.empty ?
          <p className={css(styles.element, styles.text)}>You need to select at least one video to download a selection</p>
          :
          <p className={css(styles.element, styles.text)}>You're about to convert and download <strong>10</strong> videos</p>
        }
        <Button
          className={css(styles.element)}
          onClick={this.props.onDownload}
          disabled={this.props.empty || this.props.downloading}
        >
          {this.props.downloading ? 'Downloading Selection':'Download Selection'}
        </Button>
      </section>
    )
  }
}

Toolbar.propTypes = propTypes

export default Toolbar
