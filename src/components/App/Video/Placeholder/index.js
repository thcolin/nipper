import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import styles from './styles'

class Placeholder extends Component{
  render(){
    return(
      <article className={css(styles.container)}>
        <div className={css(styles.element, styles.firstElement, styles.thumbnail)}>
          <div className={css(styles.placeholder, styles.image)} />
        </div>
        <div className={css(styles.element, styles.about)}>
          <div className={css(styles.placeholder, styles.line)} />
          <div className={css(styles.placeholder, styles.line)} />
          <div className={css(styles.placeholder, styles.line)} />
          <div className={css(styles.placeholder, styles.line)} style={{width: '40%'}} />
        </div>
        <div className={css(styles.element, styles.description)}>
          <div className={css(styles.placeholder, styles.line)} />
          <div className={css(styles.placeholder, styles.line)} />
          <div className={css(styles.placeholder, styles.line)} style={{width: '60%'}} />
        </div>
        <div className={css(styles.element, styles.lastElement, styles.actions)}>
          <div className={css(styles.placeholder, styles.line)} />
          <div className={css(styles.placeholder, styles.line)} />
          <div style={{display: 'flex'}}>
            <div className={css(styles.placeholder, styles.line)} style={{margin: '0 10px 0 0'}} />
            <div className={css(styles.placeholder, styles.line)} style={{margin: '0 0 0 10px'}} />
          </div>
        </div>
      </article>
    )
  }
}

export default Placeholder
