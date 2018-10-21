import React, { PureComponent } from 'react'
import theme from 'theme'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import Heading from 'components/atoms/Heading'
import Paragraph from 'components/atoms/Paragraph'

const suitup = (props = {}, state = {}) => ({
  element: css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  }),
  image: css({
    width: '60%'
  }),
  title: css({
    margin: '1em 0 0.5em !important',
    color: `${theme.colors.iceblack} !important`
  }),
  paragraph: css({
    fontSize: '0.875em !important',
    color: `${theme.colors.icegray} !important`
  })
})

class Illustration extends PureComponent {
  render () {
    const classes = suitup(this.props)
    const { title, message, svg, ...props } = this.props

    return (
      <div {...props} className={[props.className, classes.element].join(' ')}>
        <img src={svg} className={classes.image} />
        <Heading className={classes.title} level={4}>{this.props.title}</Heading>
        <Paragraph className={classes.paragraph}>{message}</Paragraph>
      </div>
    )
  }
}

Illustration.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.any.isRequired,
  svg: PropTypes.any.isRequired
}

export default Illustration
