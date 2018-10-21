import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import theme from 'theme'

const suitup = (props = {}, state = {}) => ({
  element: css({
    color: theme.colors.primary,
    textTransform: 'uppercase',
    fontFamily: theme.fonts.families.secondary,
    fontSize: theme.fonts.sizes[`h${props.level}`],
    fontWeight: theme.fonts.weights.black,
    lineHeight: 1.55,
    padding: 0,
    margin: 0
  })
})

const Heading = (props) => React.createElement(`h${props.level}`, {
  ...props,
  className: [css(suitup(props).element), props.className].join(' ')
})

Heading.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}

Heading.defaultProps = {
  level: 1
}

export default Heading
