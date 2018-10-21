import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import Icon from 'components/atoms/Icon'
import theme from 'theme'

const suitup = (props = {}, state = {}) => ({
  element: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.colors.light}`,
    backgroundColor: theme.colors.lighter,
    color: theme.colors.primary,
    padding: '1em 1.5em',
    ':hover': {
      ...props.onClose ? {
        cursor: 'pointer',
        background: theme.colors.lighten,
        textDecoration: 'none'
      } : {}
    }
  }),
  text: css({
    flexGrow: 1,
    margin: '0 0 0 10px',
    textAlign: 'center'
  }),
  icon: css({
    color: theme.colors.primary,
    minWidth: '1em'
  })
})

class Message extends PureComponent {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    e.preventDefault()

    if (this.props.onClose && this.props.onClose) {
      this.props.onClose()
    }
  }

  render () {
    const classes = suitup(this.props)
    const { onClose, ...props } = this.props

    return (
      <a {...props} className={[classes.element, this.props.className].join(' ')} onClick={this.handleClick}>
        <Icon children='warning' className={classes.icon} />
        <p className={classes.text}>{this.props.children}</p>
        {!!onClose && <Icon children='close' className={classes.icon} />}
      </a>
    )
  }
}

Message.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.func
}

Message.defaultProps = {
  children: 'Unknown message'
}

export default Message
