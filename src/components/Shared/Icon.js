import React, { Component, PropTypes } from 'react'

require('font-awesome/css/font-awesome.css')

const propTypes = {
  family: PropTypes.string,
  label: PropTypes.string
}

const defaultProps = {
  family: 'fa'
}

class Icon extends Component{
  render(){
    var {family, label, ...props} = this.props

    return(
      <i {...props} className={[family, label, this.props.className].join(' ')}></i>
    )
  }
}

Icon.propTypes = propTypes
Icon.defaultProps = defaultProps

export default Icon
