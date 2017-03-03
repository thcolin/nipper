import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'

const propTypes = {}
const defaultProps = {}

const styles = StyleSheet.create({
  global: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  input: {
    display: 'none'
  },
  label: {
    outline: 0,
    display: 'block',
    width: '4em',
    height: '2em',
    position: 'relative',
    cursor: 'pointer',
    userSselect: 'none',
    background: '#f0f0f0',
    borderRadius: '2em',
    margin: 0,
    padding: '2px',
    transition: 'all .4s ease',
    '@media (max-width: 810px)': {
      margin: '0 140px 0 0',
      ':after': {
        content: '"select all videos"',
        display: 'block',
        position: 'relative',
        width: '140px',
        height: '100%',
        left: '120%',
        top: '-96%',
        textTransform: 'uppercase',
        color: '#e5e5e5'
      }
    },
    ':before': {
      position: 'relative',
      display: 'block',
      content: '""',
      width: '50%',
      height: '100%',
      left: 0,
      borderRadius: '50%',
      background: '#fff',
      transition: 'all .2s ease'
    }
  },
  checked: {
    background: '#ff1744',
    ':before': {
      left: '50%'
    },
    '@media (max-width: 810px)': {
      ':after': {
        content: '"unselect all videos"',
        color: '#ff1744'
      }
    }
  }
})

class Toggle extends Component{
  constructor() {
    super()

    this.state = {checked: false}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange() {
    this.setState({
      checked: !this.state.checked
    })
  }

  render(){
    return(
      <div className={[css(styles.global), this.props.className].join(' ')}>
        <input
          id="toggle"
          type="checkbox"
          className={css(styles.input)}
          checked={this.state.checked}
          onChange={this.handleChange} />
        <label className={css(styles.label, (this.state.checked && styles.checked))} htmlFor="toggle"></label>
      </div>
    )
  }
}

Toggle.propTypes = propTypes
Toggle.defaultProps = defaultProps

export default Toggle
