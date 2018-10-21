import React, { PureComponent } from 'react'
import { css } from 'glamor'
import PropTypes from 'prop-types'
import theme from 'theme'
import Card from 'components/blocks/Card'
import Heading from 'components/atoms/Heading'
import Paragraph from 'components/atoms/Paragraph'

const suitup = (props = {}, state = {}) => ({
  element: css({
    display: 'flex',
    flexDirection: 'column',
    width: `${theme.ratio.width * 1.25}em`
  }),
  head: css({
    display: 'flex',
    alignItems: 'center',
    flexBasis: `${theme.ratio.height * 1.25}em`,
    overflow: 'hidden',
    borderTopLeftRadius: '0.25em',
    borderTopRightRadius: '0.25em'
  }),
  image: css({
    width: '100%'
  }),
  body: css({
    background: theme.colors.white,
    padding: '1em',
    borderBottomLeftRadius: '0.25em',
    borderBottomRightRadius: '0.25em'
  }),
  title: css({
    padding: '0 0 0.25em !important',
    color: `${theme.colors.black} !important`,
    fontWeight: `${theme.fonts.weights.bold} !important`,
    textTransform: 'none !important',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }),
  author: css({
    color: `${theme.colors.gray} !important`,
    fontSize: `${theme.fonts.sizes.small} !important`,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  })
})

class Tale extends PureComponent {
  render () {
    const classes = suitup(this.props)
    const { uri, link, thumbnail, title, author, ...props } = this.props

    return (
      <Card {...props} className={[classes.element, props.className].join(' ')}>
        <div className={classes.head}>
          <img src={thumbnail} className={classes.image} />
        </div>
        <div className={classes.body}>
          <Heading level={6} className={classes.title}>{title}</Heading>
          <Paragraph className={classes.author}>{author}</Paragraph>
        </div>
      </Card>
    )
  }
}

Tale.propTypes = {
  uri: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default Tale
