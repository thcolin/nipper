import React, { Component } from 'react'
import { css } from 'aphrodite'
import styles from './styles'

class Description extends Component{
  render(){
    return(
      <div className={[css(styles.container), this.props.className].join(' ')}>
        <p className={css(styles.text)}>{ this.props.children }</p>
      </div>
    )
  }
}

export default Description
