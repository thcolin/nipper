import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import styles from './styles'
import moment from 'moment'
import formater from 'moment-duration-format'

const propTypes = {
  thumbnail: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired
}

const defaultProps = {
  thumbnail: 'http://placehold.it/1280x720',
  duration: 'PT4M20S'
}

class Thumbnail extends Component{
  render(){
    let duration = moment.duration(this.props.duration)

    return(
      <div className={[css(styles.container), this.props.className].join(' ')}>
        <img src={this.props.thumbnail} className={css(styles.image)} />
        <div className={css(styles.time)}>
          {
            moment.duration(this.props.duration).format('hh:mm:ss')
          }
        </div>
      </div>
    )
  }
}

Thumbnail.propTypes = propTypes
Thumbnail.defaultProps = defaultProps

export default Thumbnail
