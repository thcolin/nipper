import React from 'react'
import { connect } from 'react-redux'
import { editVideo, shiftVideo, downloadVideo } from 'actions'
import List from 'components/Shared/List'
import Video from 'components/App/Video'

const mapStateToProps = (state) => ({
  items: state.videos
})

const mapDispatchToProps = (dispatch, ownProps) => {
  var props = Object.assign({}, ownProps)

  props.renderItem = (item, props) => {
    return (
      <Video
        key={item.id}
        {...item}
        {...props}
      />
    )
  }

  if(typeof props.itemProps === 'undefined'){
    props.itemProps = {}
  }

  props.itemProps.onChange = (id, key, value) => {
    console.log('change id3 ' + id + ' : [' + key + '] = ' + value)
    dispatch(editVideo(id, key, value))
  }

  props.itemProps.onShift = (id, to) => {
    console.log('shift ' + id + ' : ' + (to ? 'true':'false'))
    dispatch(shiftVideo(id, to))
  }

  props.itemProps.onDownload = (id, id3) => {
    console.log('download video ' + id, id3)
    dispatch(downloadVideo(id, id3))
  }

  return props
}

const VideoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(List)

export default VideoList
