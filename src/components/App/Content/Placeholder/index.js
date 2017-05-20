import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import nl2br from 'react-nl2br'
import Happy from 'resources/illustration-happy.svg'
import Sad from 'resources/illustration-sad.svg'
import styles from './styles'

const propTypes = {
  mood: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
}

class Placeholder extends Component{
  render(){
    return (
      <div className={css(styles.container)}>
        { this.props.mood === 'happy' ?
          <Happy /> : <Sad />
        }
        <h1 className={css(styles.title)}>{this.props.title}</h1>
        <p className={css(styles.subtext)}>{ nl2br(this.props.message) }</p>
      </div>
    )
  }
}

Placeholder.propTypes = propTypes

export default Placeholder
