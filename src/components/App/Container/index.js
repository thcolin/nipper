import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Video from 'components/App/Video'
import Error from 'components/Shared/Error'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  errors: PropTypes.arrayOf(Error).isRequired,
  videos: PropTypes.arrayOf(PropTypes.element).isRequired,
  showMore: PropTypes.bool,
  showLoading: PropTypes.bool
}

const defaultProps = {
  errors: [],
  videos: [],
  showMore: false,
  showLoading: false
}

class Container extends Component{
  componentWillReceiveProps(next){
    if(!!next.videos.length){

    }

    console.log('update errors', next)
  }

  render(){
    var showLoading = this.props.showLoading

    return(
      <section className={css(styles.global)}>
        {this.props.errors}
        {this.props.videos}
        {this.props.showMore &&
          <Button
            appearance={showLoading ? 'light':'plain'}
            className={css(styles.button)}
            disabled={showLoading ? true:false}
            icon={showLoading ? 'fa-circle-o-notch fa-spin fa-fw':'fa-caret-down'}
          >
            {showLoading ? 'Loading':'More'}
          </Button>
        }
      </section>
    )
  }
}

Container.propTypes = propTypes
Container.defaultProps = defaultProps

export default Container
