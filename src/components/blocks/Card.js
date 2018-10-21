import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import theme from 'theme'

const suitup = (props = {}, state = {}) => ({
  element: css({
    position: 'relative',
    backgroundColor: theme.colors.white,
    borderRadius: '0.25em',
    boxShadow: `0 0.0625em 0.125em 0`,
    color: theme.colors.shadows.dark,
    transition: 'all .2s ease',
    cursor: props.onClick !== null ? 'pointer' : 'default',
    outline: 'none',
    zIndex: 0,
    ':focus': {
      ...props.onClick !== null ? {
        transform: 'translateY(-1px)'
      } : {}
    },
    ':hover': {
      ...props.onClick !== null ? {
        transform: 'translateY(-1px)'
      } : {}
    }
  })
})

const Card = (props) => {
  const { active, ...crumbs } = props

  return (
    <div
      {...crumbs}
      {...(crumbs.onClick ? { tabIndex: 0 } : {})}
      className={[suitup(props).element, crumbs.className].join(' ')}
    />
  )
}

Card.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.bool
}

Card.defaultProps = {
  onClick: null,
  active: false
}

export default Card
