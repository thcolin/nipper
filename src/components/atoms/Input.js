import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/atoms/Icon'
import theme from 'theme'
import { css } from 'glamor'

const suitup = (props = {}, state = {}) => ({
  element: css({
    position: 'relative',
    display: 'inline-block',
    borderBottom: `1px solid ${theme.colors.silver}`,
    color: theme.colors.gray,
    transition: 'all 0.2s linear',
    ':focus-within': {
      color: theme.colors.primary,
      borderBottom: `1px solid ${theme.colors.primary}`
    }
  }),
  input: css({
    width: '100%',
    minWidth: 0,
    padding: `0 ${props.icon ? '2em' : '0em'} 0.5em 0`,
    background: 'none',
    border: 'none',
    fontFamily: theme.fonts.families.secondary,
    lineHeight: 1.25,
    color: theme.colors.gray,
    transition: 'all 0.2s linear',
    outline: 'none',
    ':focus': {
      color: theme.colors.primary
    },
    '::placeholder': {
      fontFamily: theme.fonts.families.secondary,
      color: theme.colors.gray
    },
    ':focus::placeholder': {
      color: theme.colors.primary
    },
    '::selection': {
      backgroundColor: theme.colors.light
    }
  }),
  icon: css({
    position: 'absolute',
    top: '0.25em',
    right: '0.25em'
  })
})

const Input = (props) => {
  const classes = suitup(props)
  const { icon, style, ...crumbs } = props

  return (
    <label htmlFor={crumbs.id} className={[css(classes.element), crumbs.className].join(' ')} style={style}>
      <input {...crumbs} className={classes.input} />
      {icon && <Icon children={icon} className={classes.icon} />}
    </label>
  )
}

Input.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.string
}

export default Input
