import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'

const propTypes = {
  label: PropTypes.string,
  className: PropTypes.string
}
const defaultProps = {
  label: 'Button',
  className: ''
}

const styles = StyleSheet.create({
  global: {
    color: '#ff1744',
    ':hover': {
      cursor: 'pointer',
      color: '#D50000',
      textDecoration: 'none'
    }
  },
  plain: {
    border: 'none',
    outline: 'none',
    background: '#ff1744',
    borderRadius: '30px',
    padding: '15px 20px',
    fontSize: 'large',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'white',
    ':hover': {
      background: '#F70F3C'
    },
    ':active': {
      background: '#F00835'
    }
  },
  soft: {

  },
  icon: {
    marginRight: '5px'
  }
})

class Button extends Component{
  render(){
    return(
      <button type="button" className={[css(styles.global, styles.plain), this.props.className].join(' ')}>{this.props.label}</button>
    )
  }
}

Button.propTypes = propTypes
Button.defaultProps = defaultProps

export default Button
