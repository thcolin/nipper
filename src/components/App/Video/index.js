import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Snippet from './Snippet'
import About from './About'
import Description from './Description'
import Actions from './Actions'
import Input from 'components/Shared/Input'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  id: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onShift: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
}

const defaultProps = {

}

class Video extends Component{
  constructor(props){
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleShift = this.handleShift.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
  }

  handleChange(e){
    this.props.onChange(this.props.id, e.target.name, e.target.value)
  }

  handleShift(){
    this.props.onShift(this.props.id, !this.props.selected)
  }

  handleDownload(){
    this.props.onDownload(this.props.id)
  }

  render(){
    return(
      <article className={css(styles.global, (this.props.selected && styles.selected))}>
        <Snippet className={css(styles.element, styles.firstElement)} />
        <About className={css(styles.element)} />
        <Description className={css(styles.element)}>@description</Description>
        <Actions
          className={css(styles.element, styles.lastElement)}
          onChange={this.handleChange}
          onShift={this.handleShift}
          onDownload={this.handleDownload}
        />
      </article>
    )
  }
}

Video.propTypes = propTypes
Video.defaultProps = defaultProps

export default Video
