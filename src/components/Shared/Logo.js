import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  white: {
    fill: '#ffffff'
  },
  red: {
    fill: '#ff1744'
  }
})

const propsTypes = {
  color: PropTypes.string
}

const defaultProps = {
  color: 'white'
}

class Logo extends Component{
  render(){
    var {color, ...props} = this.props

    return(
      <svg viewBox="-287 394 23 14" {...props}>
        <path d="M-286,402h-1v-1h1V402z M-264,401h-1v1h1V401z M-284,400h-1v3h1V400z M-266,400h-1v3h1V400z M-280,400h-1v3h1V400z
           M-270,399h-1v5h1V399z M-282,399h-1v5h1V399z M-268,398h-1v7h1V398z M-278,398h-1v7h1V398z M-276,396h-1v10h1V396z M-272,396h-1v10
          h1V396z M-274,394h-1v14h1V394z" className={css(styles[color])} />
      </svg>
    )
  }
}

Logo.propsTypes = propsTypes
Logo.defaultProps = defaultProps

export default Logo
