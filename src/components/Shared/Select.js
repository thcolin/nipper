import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, StyleSheet } from 'aphrodite/no-important'
import { configureContext } from 'ducks/context'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'

const propTypes = {
  selected: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.object,
  onChange: PropTypes.func.isRequired
}

const defaultProps = {
  selected: null,
  options: {
    // value: {
    //   icon: faX,
    //   label: string
    // }
  },
  active: false,
  disabled: false,
  icon: null
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '20px',
    padding: '10px',
    marginRight: '1px',
    textAlign: 'center',
    color: 'white',
    background: '#ff1744',
    borderRadius: '30px',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
    ':hover': {
      background: '#F70F3C'
    },
    ':active': {
      background: '#F00835'
    }
  },
  default: {
    background: '#cfcfcf',
  },
  active: {
    background: '#F00835'
  },
  disabled: {
    background: '#e5e5e5',
    ':hover': {
      background: '#ccc'
    },
    ':active': {
      background: '#b2b2b2'
    }
  },
  select: {
    position: 'absolute',
    opacity: 0,
    top: 0,
    left: 0,
    height: '100%',
    width:  '100%',
    borderRadius: '30px',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
    appearance: 'none',
    border: 'none',
    outline: 'none'
  },
  icon: {
    marginLeft: '3px'
  }
})

class Select extends Component{
  constructor(props){
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e){
    this.props.onChange(e.target.value)
  }

  render(){
    var {onChange, selected, options, icon, active, disabled, ...props} = this.props

    icon = icon ? icon : options[selected].icon

    return (
      <div className={css(styles.container, active && styles.active, disabled && styles.disabled, active && disabled && styles.default)}>
        <FontAwesomeIcon className={css(styles.icon)} icon={icon} {...icon.features} />
        <select
          title="Choose output format"
          {...props}
          className={[css(styles.select), props.className].join(' ')}
          onChange={this.handleChange}
          value={selected}
          disabled={active}
        >
          {
            Object.keys(options).map(option => (
              <option key={option} value={option} >{ options[option].label }</option>
            ))
          }
        </select>
      </div>
    )
  }
}

Select.propTypes = propTypes
Select.defaultProps = defaultProps

export default Select
