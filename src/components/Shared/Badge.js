import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'

const styles = StyleSheet.create({
  container:{
    display: 'inline-block',
    minWidth: '10px',
    padding: '2px 5px',
    fontSize: 'small',
    fontWeight: 700,
    lineHeight: 1,
    color: '#ff1744',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    backgroundColor: 'white',
    border: '2px solid #ff1744',
    borderRadius: '20px'
  }
})

class Badge extends Component{
  render(){
    var {className, children, ...props} = this.props

    return(
      <span {...props} className={[css(styles.container), className].join(' ')}>
        { children }
      </span>
    )
  }
}

export default Badge
