import React, { Component } from 'react'
import { css } from 'aphrodite'
import Rellax from 'rellax'
import styles from './styles'

class Parallax extends Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.state.rellax = new Rellax('.' + css(styles.container));
  }

  render(){
    return(
      <div className={css(styles.container)}>
        <img src="assets/img/picture.jpg" alt="Parallax picture" className={css(styles.image)} />
      </div>
    )
  }
}

export default Parallax
