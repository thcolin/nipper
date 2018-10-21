import React from 'react'
import theme from 'theme'
import { css } from 'glamor'

const suitup = (props = {}, state = {}) => ({
  element: css({
    color: theme.colors.primary,
    textDecoration: 'none',
    ':hover': {
      cursor: 'pointer',
      color: theme.colors.darker,
      textDecoration: 'none'
    },
    ':active': {
      cursor: 'pointer',
      color: theme.colors.darker,
      textDecoration: 'none'
    },
    ':focus': {
      cursor: 'pointer',
      color: theme.colors.darker,
      textDecoration: 'none'
    }
  })
})

const Link = (props) => (
  <a {...props} className={[css(suitup().element), props.className].join(' ')} />
)

export default Link
