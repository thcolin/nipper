import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import styles from './styles'

const propTypes = {
  image: PropTypes.string,
  duration: PropTypes.string
}

const defaultProps = {
  image: 'http://placehold.it/1280x720',
  duration: '00:00'
}

class Snippet extends Component{
  render(){
    return(
      <div className={[css(styles.global), this.props.className].join(' ')}>
        <img src={this.props.image} className={css(styles.image)} />
        <div className={css(styles.time)}>{this.props.duration}</div>
      </div>
    )
  }
}

Snippet.propTypes = propTypes
Snippet.defaultProps = defaultProps

export default Snippet
