import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import Button from 'components/atoms/Button'

const suitup = (props = {}, state = {}) => ({
  element: css({
    display: 'flex',
    visibility: props.children.length ? 'visible' : 'hidden',
    flexDirection: 'column'
  }),
  toggle: css({
    flexGrow: 1,
    textAlign: 'right',
    padding: '1em !important'
  }),
  container: css({
    display: 'flex',
    height: state.dropped ? 0 : 'auto',
    overflowX: 'auto',
    overflowY: 'hidden',
    transition: state.dropped ? 'height 0.4s ease-out' : 'height 0.4s ease-in'
  }),
  child: css({
    padding: '1em',
    ':first-child': {
      paddingLeft: '1.5em'
    },
    ':last-child': {
      paddingRight: '1.5em'
    }
  })
})

class Curtain extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dropped: true
    }

    this.references = {
      container: React.createRef()
    }

    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle () {
    const dropped = !this.state.dropped

    // Fix container `height` during transition
    const node = this.references.container.current
    const height = node.scrollHeight

    if (dropped) {
      // auto -> height -> 0
      node.style.height = `${height}px`
      setTimeout(() => node.style.height = null, 100) // eslint-disable-line no-return-assign
    } else {
      // 0 -> height
      node.style.height = `${height}px`
      node.addEventListener('transitionend', () => node.style.height = null, { once: true }) // eslint-disable-line no-return-assign
    }

    this.setState({ dropped })
  }

  render () {
    const classes = suitup(this.props, this.state)
    const { children, ...props } = this.props
    const { dropped } = this.state

    return (
      <div {...props} className={[classes.element, props.className].join(' ')}>
        <Button
          appearance='none'
          inverted
          icon={dropped ? 'up' : 'down'}
          onClick={this.handleToggle}
          className={classes.toggle}
          data-test='curtain-toggle'
        />
        <div className={classes.container} ref={this.references.container} tabIndex={-1} data-test='curtain-list'>
          {children.map((child, index) => (
            <div
              className={classes.child}
              key={index}
              onFocus={() => this.state.dropped && this.handleToggle()}
              data-test='curtain-item'
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

Curtain.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element)
}

export default Curtain
