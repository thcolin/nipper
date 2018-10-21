import React from 'react'
import PropTypes from 'prop-types'
import { css, keyframes } from 'glamor'
import icons from 'components/icons'

const suitup = (props = {}, state = {}) => ({
  element: css({
    display: 'flex',
    maxWidth: `${props.size}em`,
    ...(props.animate || state.animate ? {
      animationDuration: '2s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      animationName: keyframes({
        '0%': {
          transform: 'rotate(0deg)'
        },
        '100%': {
          transform: 'rotate(360deg)'
        }
      })
    } : {})
  })
})

const Icon = (props) => {
  const { children, grow, size, animate, ...crumbs } = props

  return grow ? (
    React.createElement(icons[children])
  ) : (
    <i {...crumbs} className={[css(suitup(props).element), props.className].join(' ')}>
      {React.createElement(icons[children], { height: '100%', width: '100%' })}
    </i>
  )
}

Icon.propTypes = {
  /**
   * Fill all space available
   */
  grow: PropTypes.bool,
  size: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  animate: PropTypes.bool,
  children: PropTypes.string.isRequired
}

Icon.defaultProps = {
  grow: false,
  size: 1,
  animate: false
}

export default Icon
