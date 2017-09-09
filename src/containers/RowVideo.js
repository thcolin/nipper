import React, { Component } from 'react'
import { connect } from 'react-redux'
import { annotateVideo, selectVideo, configureVideo, downloadVideo } from 'ducks/video'
import Video from 'components/App/Video'

const mapStateToProps = (state, props) => ({
  raw: state.videos.entities[props.id],
  locked: state.context.downloading
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (id, key, value) => dispatch(annotateVideo(id, key, value)),
  onSelect: (id, to) => dispatch(selectVideo(id, to)),
  onConfigure: (id, format) => dispatch(configureVideo(id, format)),
  onDownload: (id, tags) => dispatch(downloadVideo(id, tags))
})

class RowVideo extends Component{
  render(){
    console.log('render', this.props.raw.id)
    return (
      <Video
        {...this.props.raw}
        locked={this.props.locked}
        onChange={this.props.onChange}
        onSelect={this.props.onSelect}
        onConfigure={this.props.onConfigure}
        onDownload={this.props.onDownload}
      />
    )
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RowVideo)
