import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faPlayCircle, faHeart, faThumbsDown } from '@fortawesome/fontawesome-free-solid'
import Link from 'components/Shared/Link'
import styles from './styles'

const propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  channel: PropTypes.string.isRequired,
  views: PropTypes.number.isRequired,
  likes: PropTypes.number.isRequired,
  dislikes: PropTypes.number.isRequired
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
      <div className={[css(styles.container), this.props.className].join(' ')}>
        <p className={css(styles.paragraph)}>
          <Link href={this.props.link}>{this.props.title}</Link>
          <br />
          <span>from <strong><Link href={this.props.channel}>{this.props.author}</Link></strong></span>
        </p>
        <p className={css(styles.paragraph)}>
          <span>
            <FontAwesomeIcon icon={faPlayCircle} className={css(styles.icon)} />
            <span>{this.props.views.toLocaleString()} views</span>
          </span>
          <br />
          <span className={css(styles.likes)}>
            <FontAwesomeIcon icon={faHeart} className={css(styles.icon)} />
            <span>{this.props.likes.toLocaleString()}</span>
          </span>
          <span>&nbsp;</span>
          <span className={css(styles.dislikes)}>
            <FontAwesomeIcon icon={faThumbsDown} className={css(styles.icon)} />
            <span>{this.props.dislikes.toLocaleString()}</span>
          </span>
        </p>
      </div>
    )
  }
}

About.propTypes = propTypes
About.defaultProps = defaultProps

export default About
