import React, { PureComponent } from 'react'
import { css, keyframes } from 'glamor'
import theme from 'theme'
import PropTypes from 'prop-types'

const suitup = (props = {}, state = {}) => ({
  wave: css({
    fill: props.inverted ? theme.colors.white : theme.colors.primary,
    ...(props.animate || state.animate ? {
      animationDuration: '0.6s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
      animationName: keyframes({
        '0%': {
          transform: 'scaleY(1)',
          transformOrigin: 'center'
        },
        '20%': {
          transform: 'scaleY(1.4)',
          transformOrigin: 'center'
        },
        '40%': {
          transform: 'scaleY(1)',
          transformOrigin: 'center'
        },
        '100%': {
          transform: 'scaleY(1)',
          transformOrigin: 'center'
        }
      })
    } : {})
  })
})

class Logo extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      animate: false
    }

    this.animate = this.animate.bind(this)
  }

  animate () {
    if (!this.state.animate) {
      this.setState({ animate: true })
      setTimeout(() => this.setState({ animate: false }), 1200)
    }
  }

  render () {
    const classes = suitup(this.props, this.state)
    const { inverted, animate, ...props } = this.props

    if (!props.onClick) {
      props.onClick = this.animate
    }

    return (
      <svg viewBox='0 0 24 20' {...props}>
        <rect x='0' y='10' width='1' height='1' className={classes.wave} style={{ animationDelay: '-0.6s' }} rx='0.5' />
        <rect x='2' y='9' width='1' height='3' className={classes.wave} style={{ animationDelay: '-0.55s' }} rx='0.5' />
        <rect x='4' y='8' width='1' height='5' className={classes.wave} style={{ animationDelay: '-0.5s' }} rx='0.5' />
        <rect x='6' y='9' width='1' height='3' className={classes.wave} style={{ animationDelay: '-0.45s' }} rx='0.5' />
        <rect x='8' y='7' width='1' height='7' className={classes.wave} style={{ animationDelay: '-0.4s' }} rx='0.5' />
        <rect x='10' y='5' width='1' height='10' className={classes.wave} style={{ animationDelay: '-0.35s' }} rx='0.5' />
        <rect x='12' y='3' width='1' height='14' className={classes.wave} style={{ animationDelay: '-0.3s' }} rx='0.5' />
        <rect x='14' y='5' width='1' height='10' className={classes.wave} style={{ animationDelay: '-0.25s' }} rx='0.5' />
        <rect x='16' y='8' width='1' height='5' className={classes.wave} style={{ animationDelay: '-0.3s' }} rx='0.5' />
        <rect x='18' y='7' width='1' height='7' className={classes.wave} style={{ animationDelay: '-0.35s' }} rx='0.5' />
        <rect x='20' y='9' width='1' height='3' className={classes.wave} style={{ animationDelay: '-0.4s' }} rx='0.5' />
        <rect x='22' y='10' width='1' height='1' className={classes.wave} style={{ animationDelay: '-0.45s' }} rx='0.5' />
      </svg>
    )
  }
}

Logo.propTypes = {
  inverted: PropTypes.bool,
  animate: PropTypes.bool
}

Logo.defaultProps = {
  inverted: false,
  animate: false
}

export default Logo
