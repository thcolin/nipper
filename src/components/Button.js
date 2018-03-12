import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, StyleSheet } from 'aphrodite/no-important'
import Badge from 'components/Badge'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const propTypes = {
  appearance: PropTypes.string,
  icon: PropTypes.object,
  progress: PropTypes.number
}

const defaultProps = {
  appearance: 'plain',
  icon: {}
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
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
    boxShadow: 'inset 0 0 0 1px #ff1744',
    ':disabled': {
      boxShadow: 'inset 0 0 0 1px #e5e5e5',
      color: '#e5e5e5',
      cursor: 'default'
    }
  },
  icon: {
    marginRight: '10px'
  },
  badge: {
    position: 'absolute',
    top: '7px',
    right: '7px'
  }
})

class Button extends Component{
  render(){
    var {appearance, icon, progress, badge, style, ...props} = this.props

    icon = (typeof icon === 'string' ? {label: icon}:icon)

    return(
      <span className={css(styles.container)} style={style}>
        <button
          type="button" {...props}
          className={[css(styles.button, styles[appearance]), this.props.className].join(' ')}
          style={progress !== null ? {
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.1) ${progress}%, rgba(0, 0, 0, 0) ${progress}%)`,
          } : {}}
        >
          {icon.iconName && <FontAwesomeIcon className={css(this.props.children && styles.icon)} icon={icon} {...icon.features} />}
          <span>{ this.props.children }</span>
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
