import React, { Component } from 'react'
import { css } from 'aphrodite'
import Error from 'components/Shared/Error'
import ListError from 'containers/ListError'
import IllustrationHideable from 'containers/IllustrationHideable'
import ListVideo from 'containers/ListVideo'
import config from 'config'
import styles from './styles'

class Content extends Component{
  render(){
    return(
      <section className={css(styles.container)}>
        {config.universal ?
          <Error id={0} closable={false}>
            <span>Be aware that all actions like grabbing videos and extrat audio are directly made on <strong>your browser</strong> !</span>
          </Error> : ''
        }
        <ListError />
        <IllustrationHideable />
        <ListVideo />
      </section>
    )
  }
}

export default Content
