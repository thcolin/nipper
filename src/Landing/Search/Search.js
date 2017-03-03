import React, { Component } from 'react'
import { css } from 'aphrodite'

import Button from 'Shared/Button'

import styles from './Search.styles'

class Search extends Component{
  constructor(props){
    super(props)
    this.state = {
      error: null
    }
  }

  render(){
    return(
      <div className={css(styles.global)}>
        <input type="text" className={css(styles.element, styles.input)} name="name" placeholder="Youtube link (playlist or video)" />
        <Button className={css(styles.element, styles.button)}>Analyze</Button>
        {this.state.error &&
          <p className={css(styles.element, styles.subtitle)}>Submited link is not valid (not a Youtube video or a playlist)</p>
        }
      </div>
    )
  }
}

export default Search
