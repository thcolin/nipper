import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import Badge from 'components/Shared/Badge'
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
    position: 'relative',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    borderRadius: '30px',
    padding: '10px 15px',
    fontFamily: "'Titillium Web', sans-serif",
    fontWeight: 700,
    lineHeight: 1.42857143,
    textTransform: 'uppercase'
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
      background: '#e5e5e5',
      cursor: 'default'
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
  },
  badge: {
    position: 'absolute',
    top: '-7px',
    right: '-7px'
  }
})

class Button extends Component{
  render(){
    var {appearance, icon, badge, ...props} = this.props

    icon = (typeof icon === 'string' ? {label: icon}:icon)

    return(
      <button type="button" {...props} className={[css(styles.container, styles[appearance]), this.props.className].join(' ')}>
        {badge &&
          <Badge className={css(styles.badge)}>{ badge }</Badge>
        }
        {icon.label &&
          <Icon className={css(styles.icon)} {...icon} />
        }
        <span>{ this.props.children }</span>
      </button>
    )
  }
}

Button.propTypes = propTypes
Button.defaultProps = defaultProps

export default Button
