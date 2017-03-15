import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'

const styles = StyleSheet.create({
  container:{
    color: '#ff1744',
    ':hover': {
      cursor: 'pointer',
      color: '#D50000',
      textDecoration: 'none'
    },
    ':active': {
      cursor: 'pointer',
      color: '#D50000',
      textDecoration: 'none'
    },
    ':focus': {
      cursor: 'pointer',
      color: '#D50000',
      textDecoration: 'none'
    }
  }
})

class Link extends Component{
  render(){
    return(
      <a {...this.props} className={[css(styles.container), this.props.className].join(' ')}>{ this.props.children }</a>
    )
  }
}

export default Link
