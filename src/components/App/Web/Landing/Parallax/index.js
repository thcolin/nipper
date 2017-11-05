import React, { Component } from 'react'
import { css } from 'aphrodite'
import Rellax from 'rellax'
import picture from 'resources/picture.jpg'
import styles from './styles'

class Parallax extends Component{
  constructor(props) {
    super(props)
    this.state = {
      rellax: null
    }
  }

  componentDidMount(){
    new Rellax('.' + css(styles.container))
  }

  render(){
    return(
      <div className={css(styles.container)}>
        <img src={picture} alt="Beautiful background" className={css(styles.image)} />
      </div>
    )
  }
}

export default Parallax
