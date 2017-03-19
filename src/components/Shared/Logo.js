import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite'

const waveKeyframes = {
  '0%': {
    transform: 'scaleY(1)',
    transformOrigin: 'center'
  },
  '20%': {
    transform: 'scaleY(1.4)',
    transformOrigin: 'center'
  },
  '40%': {
    transform: 'scaleY(1)',
    transformOrigin: 'center'
  },
  '100%': {
    transform: 'scaleY(1)',
    transformOrigin: 'center'
  }
}

const styles = StyleSheet.create({
  white: {
    fill: '#ffffff'
  },
  red: {
    fill: '#ff1744'
  },
  wave: {
    animationName: [waveKeyframes],
    animationDuration: '0.6s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite'
  }
})

const propsTypes = {
  color: PropTypes.string
}

const defaultProps = {
  color: 'white'
}

class Logo extends Component{
  constructor(props){
    super(props)
    this.state = {
      animated: false
    }

    this.animate = this.animate.bind(this)
  }

  animate(){
    if(!this.state.animated){
      this.setState({animated: true})
      setTimeout(() => {
        this.setState({animated: false})
      }, 1800)
    }
  }

  render(){
    var {color, animate, ...props} = this.props

    if(!props.onClick){
      props.onClick = this.animate
    }

    var className = css(styles[color], (animate && styles.wave) || (this.state.animated && styles.wave))

    return(
      <svg viewBox="0 0 24 18" {...props}>
        <rect x="0" y="9" width="1" height="1" className={className} style={{animationDelay: '-0.6s'}} />
        <rect x="2" y="8" width="1" height="3" className={className} style={{animationDelay: '-0.55s'}} />
        <rect x="4" y="7" width="1" height="5" className={className} style={{animationDelay: '-0.5s'}} />
        <rect x="6" y="8" width="1" height="3" className={className} style={{animationDelay: '-0.45s'}} />
        <rect x="8" y="6" width="1" height="7" className={className} style={{animationDelay: '-0.4s'}} />
        <rect x="10" y="4" width="1" height="10" className={className} style={{animationDelay: '-0.35s'}} />
        <rect x="12" y="2" width="1" height="14" className={className} style={{animationDelay: '-0.3s'}} />
        <rect x="14" y="4" width="1" height="10" className={className} style={{animationDelay: '-0.25s'}} />
        <rect x="16" y="7" width="1" height="5" className={className} style={{animationDelay: '-0.3s'}} />
        <rect x="18" y="6" width="1" height="7" className={className} style={{animationDelay: '-0.35s'}} />
        <rect x="20" y="8" width="1" height="3" className={className} style={{animationDelay: '-0.4s'}} />
        <rect x="22" y="9" width="1" height="1" className={className} style={{animationDelay: '-0.45s'}} />
      </svg>
    )
  }
}

Logo.propsTypes = propsTypes
Logo.defaultProps = defaultProps

export default Logo
