import React, { Component } from 'react'
import { connect } from 'react-redux'
import { annotateVideo, selectVideo, downloadVideo } from 'ducks/video'
import Video from 'components/App/Video'

const mapStateToProps = (state, ownProps) => ({
  raw: state.videos[ownProps.id]
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (id, key, value) => dispatch(annotateVideo(id, key, value)),
  onSelect: (id, to) => dispatch(selectVideo(id, to)),
  onDownload: (id, id3) => dispatch(downloadVideo(id, id3))
})

class FilledVideo extends Component{
  render(){
    console.log('render filled video', this.props.id)
    return (
      <Video
        {...this.props.raw}
        onChange={this.props.onChange}
        onSelect={this.props.onSelect}
        onDownload={this.props.onDownload}
      />
    )
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilledVideo)
