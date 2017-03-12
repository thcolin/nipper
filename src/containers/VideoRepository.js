import React from 'react'
import { connect } from 'react-redux'
import { toggleVideo } from 'actions'
import Repository from 'components/App/Repository'

const mapStateToProps = (state) => {
  return {
    videos: state.videos,
    errors: state.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleVideo: (to) => {
      dispatch(toggleVideo(to))
    },
    onDownloadVideo: () => {
      console.log('onDownloadVideo')
    }
  }
}

const VideoRepository = connect(
  mapStateToProps,
  mapDispatchToProps
)(Repository)

export default VideoRepository
