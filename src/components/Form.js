import React, { Component } from 'react'
import { css } from 'glamor'
import PropTypes from 'prop-types'
import Button from 'components/atoms/Button'
import theme from 'theme'

const suitup = (props = {}, state = {}) => ({
  element: css({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    borderRadius: '0.25em',
    overflow: 'hidden',
    transition: 'all .2s ease',
    ...(props.onSubmit && state.focused ? {
      transform: 'translateY(-1px)'
    } : {})
  }),
  input: css({
    width: !props.ready ? 0 : '100%',
    minWidth: 0,
    backgroundColor: theme.colors.transablack,
    color: theme.colors.white,
    padding: !props.ready ? '1em 0' : '1em 1.5em',
    fontFamily: theme.fonts.families.primary,
    lineHeight: 1.25,
    border: 'none',
    outline: 'none !important',
    transition: !props.ready ? 'width 400ms ease-in, padding 100ms ease-out 375ms' : 'width 400ms ease-out 75ms, padding 100ms ease-in',
    ':disabled': {
      width: 0,
      padding: '1em 0'
    },
    ':invalid': {
      boxShadow: 'none'
    },
    '::placeholder': {
      color: theme.colors.white,
      fontFamily: "'Titillium Web', sans-serif",
      textOverflow: 'ellipsis',
      opacity: 0.5
    }
  }),
  submit: css({
    flexGrow: 1,
    width: '4em',
    padding: '1em 1.25em !important',
    borderRadius: '0 !important',
    outline: 'none !important'
  })
})

class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.value,
      focused: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggleFocus = this.toggleFocus.bind(this)
  }

  getSnapshotBeforeUpdate (props, state) {
    if (this.props.value !== props.value) {
      return this.props.value
    }

    return null
  }

  componentDidUpdate (props, state, snapshot) {
    /* eslint-disable react/no-did-update-set-state */
    if (snapshot !== null) {
      this.setState({
        value: snapshot
      })
    }
    /* eslint-enable react/no-did-update-set-state */
  }

  toggleFocus (to) {
    this.setState({ focused: to })
  }

  handleChange (e) {
    this.setState({
      value: e.target.value
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.onSubmit(this.state.value)
  }

  render () {
    const classes = suitup(this.props, this.state)
    const { value, placeholder, ready, icon, animate, progress, label, ...props } = this.props

    return (
      <form {...props} className={[classes.element, props.className].join(' ')} onSubmit={this.handleSubmit}>
        <input
          type='search'
          className={classes.input}
          onChange={this.handleChange}
          onFocus={() => this.toggleFocus(true)}
          onBlur={() => this.toggleFocus(false)}
          value={this.state.value}
          placeholder={placeholder}
          disabled={props.disabled || !ready}
          required
        />
        <Button
          type='submit'
          className={classes.submit}
          icon={icon}
          animate={animate}
          progress={progress}
          disabled={props.disabled}
          inverted
          onFocus={() => this.toggleFocus(true)}
          onBlur={() => this.toggleFocus(false)}
          tabIndex={!ready ? 0 : -1}
          children={label}
        />
      </form>
    )
  }
}

Form.propTypes = {
  value: PropTypes.any.isRequired,
  placeholder: PropTypes.string,
  ready: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  animate: PropTypes.bool,
  label: PropTypes.string,
  progress: PropTypes.number,
  onSubmit: PropTypes.func
}

Form.defaultProps = {
  placeholder: '',
  ready: true,
  disabled: false,
  progress: null,
  animate: false
}

export default Form
