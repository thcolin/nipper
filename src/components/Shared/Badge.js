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
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.5)',
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
