import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import Happy from 'resources/illustration-happy.svg'
import Sad from 'resources/illustration-sad.svg'
import styles from './styles'

const propTypes = {
  mood: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.any.isRequired,
}

class Illustration extends Component{
  render(){
    return (
      <div className={[this.props.className, css(styles.container)].join(' ')}>
        { this.props.mood === 'happy' ? <Happy /> : <Sad /> }
        <h1 className={css(styles.title)}>{this.props.title}</h1>
        <p className={css(styles.subtext)}>{ this.props.message }</p>
      </div>
    )
  }
}

Illustration.propTypes = propTypes

export default Illustration
