import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Icon from 'components/Shared/Icon'
import Input from 'components/Shared/Input'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  artist: PropTypes.string,
  title: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
}

const defaultProps = {
  artist: '',
  title: ''
}

class Actions extends Component{
  render(){
    return(
      <div className={[css(styles.global), this.props.className].join(' ')}>
        <div className={css(styles.inputs)}>
          <Input icon="fa-user" type="text" placeholder="Artist" />
          <Input icon="fa-music" type="text" placeholder="Title" />
        </div>
        <div className={css(styles.buttons)}>
          <Button appearance="light" icon="fa-plus" className={css(styles.toggle)} onClick={this.props.onSelect}>Include</Button>
          <Button className={css(styles.download)} onClick={this.props.onDownload}>Download</Button>
        </div>
      </div>
    )
  }
}

Actions.propTypes = propTypes
Actions.defaultProps = defaultProps

export default Actions
