import React, { Component } from 'react'
import { css } from 'aphrodite'
import Error from 'components/Error'
import GroupError from 'containers/GroupError'
import IllustrationHideable from 'containers/IllustrationHideable'
import ListVideo from 'containers/ListVideo'
import styles from './styles'
import uuidv4 from 'uuid/v4'

class Corpus extends Component{
  render(){
    return(
      <section className={css(styles.container)}>
        <Error uuid={uuidv4()} closable={false}>
          <span>Keep in mind that <strong>downloading</strong> or <strong>converting</strong> into specific codec, are directly made by <strong>your browser</strong> !</span>
        </Error>
        <GroupError />
        <IllustrationHideable className={css(styles.placeholder)} />
        <ListVideo />
      </section>
    )
  }
}

export default Corpus
