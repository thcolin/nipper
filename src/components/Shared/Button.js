import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import Badge from 'components/Shared/Badge'
import Icon from 'components/Shared/Icon'

const propTypes = {
  appearance: PropTypes.string,
  icon: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  progress: React.PropTypes.number
}

const defaultProps = {
  appearance: 'plain',
  icon: {}
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    border: 'none',
    overflow: 'hidden',
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
    top: '7px',
    right: '7px'
  },
  progress: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'black',
    opacity: 0.1
  }
})

class Button extends Component{
  render(){
    var {appearance, icon, badge, progress, style, ...props} = this.props

    icon = (typeof icon === 'string' ? {label: icon}:icon)

    return(
      <span style={style}>
        <button type="button" {...props} className={[css(styles.button, styles[appearance]), this.props.className].join(' ')}>
          {icon.label &&
            <Icon className={css(styles.icon)} {...icon} />
          }
          <span>{ this.props.children }</span>
          {progress !== null &&
            <div className={css(styles.progress)} style={{width: progress + '%'}} />
          }
        </button>
        {badge &&
          <Badge className={css(styles.badge)}>{ badge }</Badge>
        }
      </span>
    )
  }
}

Button.propTypes = propTypes
Button.defaultProps = defaultProps

export default Button
