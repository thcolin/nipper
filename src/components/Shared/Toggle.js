import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'

const propTypes = {
  toggled: PropTypes.bool,
  onToggle: PropTypes.func.isRequired
}

const defaultProps = {
  toggled: false
}

const styles = StyleSheet.create({
  container: {
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
      // margin: '0 140px 0 0',
      // ':after': {
      //   content: '"select all videos"',
      //   display: 'block',
      //   position: 'relative',
      //   width: '140px',
      //   height: '100%',
      //   left: '120%',
      //   top: '-96%',
      //   textTransform: 'uppercase',
      //   color: '#e5e5e5'
      // }
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
  toggled: {
    background: '#ff1744',
    ':before': {
      left: '50%'
    },
    '@media (max-width: 810px)': {
      // ':after': {
      //   content: '"unselect all videos"',
      //   color: '#ff1744'
      // }
    }
  },
  disabled:{
    cursor: 'default'
  }
})

class Toggle extends Component{
  constructor(props){
    super(props)
    this.state = {
      toggled: false
    }

    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle(e){
    var toggled = e.target.checked
    this.setState({toggled: toggled})
    this.props.onToggle(toggled)
  }

  render(){
    var {toggled, onToggle, ...props} = this.props

    return(
      <div className={[css(styles.container), this.props.className].join(' ')}>
        <input
          {...props}
          id="toggle"
          type="checkbox"
          checked={this.state.toggled}
          className={css(styles.input)}
          onChange={this.handleToggle} />
        <label className={css(styles.label, (this.state.toggled && styles.toggled), (props.disabled && styles.disabled))} htmlFor="toggle"></label>
      </div>
    )
  }
}

Toggle.propTypes = propTypes
Toggle.defaultProps = defaultProps

export default Toggle
