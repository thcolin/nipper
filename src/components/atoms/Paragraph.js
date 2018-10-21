import React from 'react'
import { css } from 'glamor'
import theme from 'theme'

const suitup = (props = {}, state = {}) => ({
  element: css({
    color: theme.colors.black,
    fontFamily: theme.fonts.families.secondary,
    fontSize: theme.fonts.sizes.large,
    fontWeight: theme.fonts.weights.regular,
    lineHeight: 1.25,
    padding: 0,
    margin: 0
  })
})

const Paragraph = (props) => (
  <p {...props} className={[css(suitup(props).element), props.className].join(' ')} />
)

export default Paragraph
