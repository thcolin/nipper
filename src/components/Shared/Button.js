import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import Icon from 'components/Shared/Icon'

const propTypes = {
  appearance: PropTypes.string,
  icon: PropTypes.string
}

const defaultProps = {
  appearance: 'plain',
  icon: ''
}

const styles = StyleSheet.create({
  global: {
    border: 'none',
    outline: 'none',
    borderRadius: '30px',
    padding: '10px 15px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  plain: {
    background: '#ff1744',
    color: 'white',
    ':hover': {
      background: '#F70F3C'
    },
    ':active': {
      background: '#F00835'
    },
    ':disabled': {
      background: '#e5e5e5'
    }
  },
  light: {
    background: 'transparent',
    color: '#ff1744',
    border: '1px solid #ff1744'
  },
  icon: {
    marginRight: '5px'
  }
})

class Button extends Component{
  render(){
    var {appearance, icon, ...props} = this.props

    return(
      <button type="button" {...props} className={[css(styles.global, styles[appearance]), this.props.className].join(' ')}>
        {this.props.icon &&
          <Icon label={icon} className={css(styles.icon)} />
        }
        { this.props.children }
      </button>
    )
  }
}

Button.propTypes = propTypes
Button.defaultProps = defaultProps

export default Button
