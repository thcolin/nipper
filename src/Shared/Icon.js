import React, { Component, PropTypes } from 'react'

const propTypes = {
  family: PropTypes.string,
  label: PropTypes.string
}

const defaultProps = {
  family: 'fa'
}

class Icon extends Component{
  render(){
    return(
      <i {...this.props} className={[this.props.family, this.props.label, this.props.className].join(' ')}></i>
    )
  }
}

Icon.propTypes = propTypes
Icon.defaultProps = defaultProps

export default Icon
