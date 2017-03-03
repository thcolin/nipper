import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'

import Icon from 'Shared/Icon'
import Link from 'Shared/Link'

import styles from './About.styles'

const propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  author: PropTypes.string,
  channel: PropTypes.string,
  views: PropTypes.number,
  likes: PropTypes.number,
  dislikes: PropTypes.number
}

const defaultProps = {
  title: '@title',
  link: 'https://www.youtube.com/',
  author: '@author',
  channel: 'https://www.youtube.com/channels',
  views: 0,
  likes: 0,
  dislikes: 0
}

class About extends Component{
  render(){
    return(
      <div className={[css(styles.global), this.props.className].join(' ')}>
        <p>
          <Link href={this.props.link}>{this.props.title}</Link>
          <br />
          <span>from <strong><Link href={this.props.channel}>{this.props.author}</Link></strong></span>
        </p>
        <p>
          <span>
            <Icon label="fa-play-circle" className={css(styles.icon)} />
            <span>{this.props.views} views</span>
          </span>
          <br />
          <span className={css(styles.likes)}>
            <Icon label="fa-heart" className={css(styles.icon)} />
            <span>{this.props.likes}</span>
          </span>
          <span>&nbsp;</span>
          <span className={css(styles.dislikes)}>
            <Icon label="fa-thumbs-down" className={css(styles.icon)} />
            <span>{this.props.dislikes}</span>
          </span>
        </p>
      </div>
    )
  }
}

About.propTypes = propTypes
About.defaultProps = defaultProps

export default About
