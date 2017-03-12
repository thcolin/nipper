import React, { Component } from 'react'
import { css } from 'aphrodite'
import ErrorList from 'containers/ErrorList'
import VideoList from 'containers/VideoList'
import styles from './styles'

class Repository extends Component{
  render(){
    return(
      <section className={css(styles.global)}>
        <ErrorList />
        <VideoList />
      </section>
    )
  }
}

export default Repository
