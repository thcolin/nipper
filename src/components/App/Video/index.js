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
  // props
  id: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  // data
  thumbnail: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  channel: PropTypes.string.isRequired,
  views: PropTypes.number.isRequired,
  likes: PropTypes.number.isRequired,
  dislikes: PropTypes.number.isRequired,
  // id3
  artist: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // functions
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
      <article className={css(styles.container, (this.props.selected && styles.selected))}>
        <Snippet
          className={css(styles.element, styles.firstElement)}
          duration={this.props.duration}
          thumbnail={this.props.thumbnail}
        />
        <About
          className={css(styles.element)}
          title={this.props.title}
          link={this.props.link}
          author={this.props.author}
          channel={this.props.channel}
          views={this.props.views}
          likes={this.props.likes}
          dislikes={this.props.dislikes}
        />
        <Description className={css(styles.element)}>{this.props.description}</Description>
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
