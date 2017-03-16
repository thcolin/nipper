import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import styles from './styles'

const propTypes = {
  thumbnail: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired
}

const defaultProps = {
  thumbnail: 'http://placehold.it/1280x720',
  duration: '00T12'
}

class Snippet extends Component{
  render(){
    return(
      <div className={[css(styles.container), this.props.className].join(' ')}>
        <img src={this.props.thumbnail} className={css(styles.image)} />
        <div className={css(styles.time)}>{this.props.duration}</div>
      </div>
    )
  }
}

Snippet.propTypes = propTypes
Snippet.defaultProps = defaultProps

export default Snippet
