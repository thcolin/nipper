import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import Icon from 'components/Shared/Icon'

const propTypes = {
  appearance: PropTypes.string,
  icon: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ])
}

const defaultProps = {
  appearance: 'plain',
  icon: {}
}

const styles = StyleSheet.create({
  container: {
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
    background: 'white',
    color: '#ff1744',
    fontWeight: 600,
    border: '1px solid #ff1744'
  },
  icon: {
    marginRight: '10px'
  }
})

class Button extends Component{
  render(){
    var {appearance, icon, ...props} = this.props

    icon = (typeof icon === 'string' ? {label: icon}:icon)

    return(
      <button type="button" {...props} className={[css(styles.container, styles[appearance]), this.props.className].join(' ')}>
        {icon.label &&
          <Icon className={this.props.children && css(styles.icon)} {...icon} />
        }
        { this.props.children }
      </button>
    )
  }
}

Button.propTypes = propTypes
Button.defaultProps = defaultProps

export default Button
