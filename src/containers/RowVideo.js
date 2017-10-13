import React, { Component } from 'react'
import { connect } from 'react-redux'
import { annotateVideo, selectVideo, configureVideo, downloadVideo } from 'ducks/video'
import Video from 'components/App/Video'

const mapStateToProps = (state, props) => ({
  raw: state.videos.entities[props.uuid],
  locked: state.context.downloading
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (key, value) => dispatch(annotateVideo(ownProps.uuid, key, value)),
  onSelect: (to) => dispatch(selectVideo(ownProps.uuid, to)),
  onConfigure: (format) => dispatch(configureVideo(ownProps.uuid, format)),
  onDownload: (tags) => dispatch(downloadVideo(ownProps.uuid, tags))
})

class RowVideo extends Component{
  render(){
    return (
      <Video
        {...this.props.raw}
        locked={this.props.locked}
        onChange={this.props.onChange}
        onSelect={this.props.onSelect}
        onConfigure={this.props.onConfigure}
        onDownload={this.props.onDownload}
        style={this.props.style}
      />
    )
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RowVideo)
