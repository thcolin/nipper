import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite'

const style = StyleSheet.create({
  color: '#ff1744',
  ':hover': {
    cursor: 'pointer',
    color: #D50000;
    textDecoration: 'none';
  }
})

class Link extends Component{
  render(){
    return(
      <a {...this.props} className={css(style)}></a>
    )
  }
}

export default Link
