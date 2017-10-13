import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import styles from './styles'
import moment from 'moment'
import formater from 'moment-duration-format'

const propTypes = {
  thumbnail: PropTypes.any.isRequired,
  duration: PropTypes.string.isRequired
}

const defaultProps = {
  duration: 'PT4M20S'
}

class Thumbnail extends Component{
  constructor(props){
    super(props)

    const reader = new FileReader()
    reader.onloadend = () => this.setState({ b64: reader.result })

    this.state = {
      reader: reader,
      b64: null
    }
  }

  componentWillMount(){
    this.state.reader.readAsDataURL(this.props.thumbnail)
  }

  componentWillReceiveProps(props){
    if (props.thumbnail !== this.props.thumbnail) {
      this.state.reader.readAsDataURL(props.thumbnail)
    }
  }

  render(){
    var duration = moment.duration(this.props.duration)

    return(
      <div className={[css(styles.container, (!this.state.b64 && styles.placeholder)), this.props.className].join(' ')}>
        { this.state.b64 && <img src={this.state.b64} className={css(styles.image)} /> }
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
