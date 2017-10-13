import React, { Component } from 'react'
import { css } from 'aphrodite'
import Error from 'components/Shared/Error'
import ListError from 'containers/ListError'
import PlaceholderHideable from 'containers/PlaceholderHideable'
import ListVideo from 'containers/ListVideo'
import config from 'config'
import styles from './styles'
import uuidv4 from 'uuid/v4'

class Content extends Component{
  render(){
    return(
      <section className={css(styles.container)}>
        {config.universal ?
          <Error uuid={uuidv4()} closable={false}>
            <span>Keep in mind that all actions like grabbing videos and extrat audio are directly made on <strong>your browser</strong> !</span>
          </Error> : ''
        }
        <ListError />
        <PlaceholderHideable />
        <ListVideo />
      </section>
    )
  }
}

export default Content
