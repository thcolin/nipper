import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import styles from './styles'
import moment from 'moment'
import formater from 'moment-duration-format'

const propTypes = {
  thumbnail: PropTypes.any,
  duration: PropTypes.string.isRequired
}

const defaultProps = {
  duration: 'PT4M20S'
}

class Thumbnail extends Component{
  render(){
    var duration = moment.duration(this.props.duration)
    var source = this.props.thumbnail

    if(source !== null && typeof source === 'object' && source.constructor.name === 'ArrayBuffer'){
      source = 'data:image/jpeg;base64,' + btoa(String.fromCharCode(...new Uint8Array(source)))
    }

    return(
      <div className={[css(styles.container, (!source && styles.placeholder)), this.props.className].join(' ')}>
        { source && <img src={source} className={css(styles.image)} /> }
        <div className={css(styles.time)}>
          { (duration.asSeconds() < 60 ? '00:' : '') + duration.format('hh:mm:ss') }
        </div>
      </div>
    )
  }
}

Thumbnail.propTypes = propTypes
Thumbnail.defaultProps = defaultProps

export default Thumbnail
