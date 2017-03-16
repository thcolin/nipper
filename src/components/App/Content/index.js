import React, { Component } from 'react'
import { css } from 'aphrodite'
import ErrorList from 'containers/ErrorList'
import VideoList from 'containers/VideoList'
import styles from './styles'

class Content extends Component{
  render(){
    return(
      <section className={css(styles.container)}>
        <ErrorList />
        <VideoList />
      </section>
    )
  }
}

export default Content
