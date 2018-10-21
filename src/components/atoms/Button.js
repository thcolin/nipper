import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import Icon from 'components/atoms/Icon'
import theme from 'theme'

const suitup = (props = {}, state = {}) => ({
  element: css({
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    cursor: 'pointer',
    borderRadius: !props.children && props.appearance === 'none' ? 0 : '1.5em',
    padding: props.children ? '0.5em 1em' : '0.5em',
    fontFamily: theme.fonts.families.secondary,
    fontWeight: theme.fonts.weights.bold,
    fontSize: `${props.size}em`,
    lineHeight: 1.25,
    textTransform: 'uppercase',
    zIndex: 0
  }),
  content: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap'
  }),
  plain: css({
    background: props.inverted ? theme.colors.white : theme.colors.primary,
    color: props.inverted ? theme.colors.primary : theme.colors.white,
    ':hover': {
      background: props.inverted ? theme.colors.white : theme.colors.dark
    },
    ':focus': {
      background: props.inverted ? theme.colors.white : theme.colors.darken
    },
    ':disabled': {
      background: theme.colors.silver,
      color: theme.colors.white,
      cursor: 'default'
    }
  }),
  light: css({
    background: props.inverted ? 'none' : theme.colors.white,
    color: props.inverted ? theme.colors.white : theme.colors.primary,
    boxShadow: `inset 0 0 0 0.175em ${props.inverted ? theme.colors.white : theme.colors.primary}`,
    ':disabled': {
      boxShadow: `inset 0 0 0 0.175em ${theme.colors.silver}`,
      color: theme.colors.silver,
      cursor: 'default'
    }
  }),
  none: css({
    background: 'none',
    color: props.inverted ? theme.colors.white : theme.colors.primary,
    ':disabled': {
      color: theme.colors.silver,
      cursor: 'default'
    }
  }),
  progress: css({
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: -1
  }),
  icon: css({
    flexShrink: 0
  }),
  overflow: css({
    overflow: 'hidden'
  }),
  children: css({
    margin: '0 0 0 0.75em'
  })
})

class Button extends PureComponent {
  render () {
    const classes = suitup(this.props)
    const { appearance, inverted, icon, animate, progress, size, children, ...props } = this.props

    const angle = Math.max(12, 360 * (progress / 100))
    const end = ((angle - 90) * Math.PI) / 180
    const pie = `M100,100 v-100 a100,100 0 ${(angle < 180 ? '0' : '1')},1 ${Math.cos(end) * 100},${100 + (Math.sin(end) * 100)} z`

    return (
      <button
        {...props}
        title={props.title ? props.title : progress ? `${progress}%` : ''}
        className={[classes.element, classes[appearance], props.className].join(' ')}
      >
        {appearance !== 'none' && progress !== null && (
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' preserveAspectRatio='none' className={classes.progress}>
            {children && <rect fill='rgba(0, 0, 0, 0.2)' x='0' y='0' width={`${progress}%`} height='100%' />}
            {!children && angle === 360 && <circle fill='rgba(0, 0, 0, 0.2)' cx='100' cy='100' r='100' />}
            {!children && angle < 360 && <path fill='rgba(0, 0, 0, 0.2)' d={pie} />}
          </svg>
        )}
        <span className={classes.content}>
          {icon && <Icon className={classes.icon} children={icon} animate={animate} />}
          {children && <span className={classes.overflow}><span className={classes.children}>{children}</span></span>}
        </span>
      </button>
    )
  }
}

Button.propTypes = {
  /**
   * Describe `Button` style
   */
  appearance: PropTypes.oneOf(['plain', 'light', 'none']),
  /**
   * Invert colors (primary > white)
   */
  inverted: PropTypes.bool,
  /**
   * Add `Icon` on the left
   */
  icon: PropTypes.string,
  /**
   * Animate `Icon`
   */
  animate: PropTypes.bool,
  /**
   * Display progress background shadow
   */
  progress: PropTypes.number,
  size: PropTypes.number,
  onClick: PropTypes.func,
  children: PropTypes.element
}

Button.defaultProps = {
  appearance: 'plain',
  inverted: false,
  icon: null,
  animate: false,
  progress: null,
  size: 1
}

export default Button
