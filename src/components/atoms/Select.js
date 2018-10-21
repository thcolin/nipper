import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import theme from 'theme'
import Icon from 'components/atoms/Icon'

const suitup = (props = {}, state = {}) => ({
  element: css({
    position: 'relative',
    display: 'inline-block',
    height: '1em',
    width: '1em'
  }),
  select: css({
    position: 'absolute',
    opacity: 0,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    appearance: 'none',
    border: 'none',
    ':enabled': {
      cursor: 'pointer'
    }
  }),
  icon: css({
    color: props.disabled ? theme.colors.silver : theme.colors.primary,
    ':hover': {
      color: props.disabled ? theme.colors.silver : theme.colors.dark
    }
  })
})

const Select = (props) => {
  const classes = suitup(props)
  const { options, onChange, ...crumbs } = props

  return (
    <label htmlFor={crumbs.id} className={[classes.element, crumbs.className].join(' ')}>
      <select {...crumbs} onChange={e => onChange(e.target.value)} className={classes.select}>
        {Object.keys(options).map(key => <option key={key} {...options[key]} />)}
      </select>
      <Icon children={options[crumbs.value] ? options[crumbs.value].icon : 'warning'} className={classes.icon} />
    </label>
  )
}

Select.propTypes = {
  options: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

Select.defaultProps = {
  options: []
}

export default Select
