import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Thumbnail from './Thumbnail'
import About from './About'
import Description from './Description'
import Actions from './Actions'
import Input from 'components/Shared/Input'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  details: PropTypes.shape({
    thumbnail: PropTypes.string,
    duration: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    channel: PropTypes.string
  }).isRequired,
  statistics: PropTypes.shape({
    views: PropTypes.number,
    likes: PropTypes.number,
    dislikes: PropTypes.number
  }).isRequired,
  id3: PropTypes.shape({
    song: PropTypes.string,
    artist: PropTypes.string,
    cover: PropTypes.instanceOf(ArrayBuffer)
  }).isRequired,
  onShift: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
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
    this.props.onDownload(this.props.id, this.props.id3)
  }

  render(){
    return(
      <article className={css(styles.container, (this.props.selected && styles.selected))}>
        <Thumbnail
          className={css(styles.element, styles.firstElement)}
          thumbnail={this.props.details.thumbnail}
          duration={this.props.details.duration}
        />
        <About
          className={css(styles.element)}
          title={this.props.details.title}
          link={'https://youtu.be/' + this.props.id}
          author={this.props.details.author}
          channel={'https://www.youtube.com/channel/' + this.props.details.channel}
          views={this.props.statistics.views}
          likes={this.props.statistics.likes}
          dislikes={this.props.statistics.dislikes}
        />
        <Description className={css(styles.element)}>{this.props.details.description}</Description>
        <Actions
          className={css(styles.element, styles.lastElement)}
          values={this.props.id3}
          shifted={this.props.selected}
          onChange={this.handleChange}
          onShift={this.handleShift}
          onDownload={this.handleDownload}
        />
      </article>
    )
  }
}

Video.propTypes = propTypes

export default Video
