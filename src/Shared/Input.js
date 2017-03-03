import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'

import Icon from 'Shared/Icon'

const propTypes = {
  icon: PropTypes.string
}

const defaultProps = {
  icon: ''
}

const styles = StyleSheet.create({
  global:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    margin: '0 0 15px 0',
    border: '1px solid #ff1744',
    borderRadius: '20px'
  },
  icon: {
    padding: '0 0 0 15px',
    color: '#ff1744'
  },
  input: {
    width: '100%',
    border: 'none',
    color: '#ff1744',
    background: 'transparent',
    outline: 'none',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: '7px 15px',
    transition: 'all 0.30s ease-in-out'
  }
})

class Input extends Component{
  render(){
    return(
      <div className={css(styles.global)}>
        {this.props.icon &&
          <Icon label={this.props.icon} className={css(styles.icon)} />
        }
        <input className={css(styles.input)} {...this.props} />
      </div>
    )
  }
}

Input.propTypes = propTypes
Input.defaultProps = defaultProps

export default Input
