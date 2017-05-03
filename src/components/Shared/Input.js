import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import Icon from 'components/Shared/Icon'

const propTypes = {
  icon: PropTypes.string
}

const defaultProps = {
  icon: ''
}

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    margin: '0 0 15px 0',
    border: '1px solid #ff1744',
    color: '#ff1744',
    borderRadius: '20px',
    transition: 'all 0.30s ease-in-out'
  },
  disabled: {
    border: '1px solid #e5e5e5',
    color: '#e5e5e5'
  },
  icon: {
    padding: '0 0 0 15px'
  },
  input: {
    width: '100%',
    border: 'none',
    color: '#ff1744',
    background: 'transparent',
    outline: 'none',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: '10px 15px',
    transition: 'all 0.30s ease-in-out',
    ':disabled': {
      color: '#e5e5e5'
    }
  }
})

class Input extends Component{
  render(){
    var {icon, ...props} = this.props

    return(
      <div className={css(styles.container, this.props.disabled && styles.disabled)}>
        {icon &&
          <Icon label={icon} className={css(styles.icon)} />
        }
        <input {...props} className={css(styles.input)} />
      </div>
    )
  }
}

Input.propTypes = propTypes
Input.defaultProps = defaultProps

export default Input
