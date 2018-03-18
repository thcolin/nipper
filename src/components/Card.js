import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, StyleSheet } from 'aphrodite/no-important'

const propTypes = {
  header: PropTypes.any.isRequired,
  body: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 1px 2px 0 rgba(120, 20, 61, 0.6)',
    position: 'relative',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform .2s ease',
    ':hover': {
      transform: 'translateY(-1px)',
    },
    ':hover:after': {
      opacity: 1
    },
    ':after': {
      bottom: 0,
      boxShadow: '0 10px 20px 0 rgba(120, 20, 61, 0.6)',
      content: '""',
      left: 0,
      opacity: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      transition: 'opacity .25s ease-out',
      willChange: 'opacity',
      zIndex: -1,
    }
  },
  header: {
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    overflow: 'hidden',
  },
  body: {

  }
})

class Card extends Component {
  render () {
    return (
      <div className={[css(styles.wrapper), this.props.className].join(' ')} onClick={this.props.onClick}>
        <div className={css(styles.header)}>
          {this.props.header}
        </div>
        <div className={css(styles.body)}>
          {this.props.body}
        </div>
      </div>
    )
  }
}

Card.propTypes = propTypes

export default Card
