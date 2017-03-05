import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Snippet from './Snippet'
import About from './About'
import Description from './Description'
import Actions from './Actions'
import styles from './styles'

const propTypes = {
  selected: PropTypes.bool,
  onDownload: PropTypes.func.isRequired
}

const defaultProps = {
  selected: false
}

class Video extends Component{
  constructor(props){
    super(props)

    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(){
    this.props.selected = !this.props.selected
  }

  render(){
    return(
      <article className={css(styles.global, (this.props.selected && styles.selected))}>
        <Snippet className={css(styles.element, styles.firstElement)} />
        <About className={css(styles.element)} />
        <Description className={css(styles.element)}>@description</Description>
        <Actions
          className={css(styles.element, styles.lastElement)}
          onSelect={this.handleSelect}
          onDownload={this.props.onDownload}
        />
      </article>
    )
  }
}

Video.propTypes = propTypes
Video.defaultProps = defaultProps

export default Video
