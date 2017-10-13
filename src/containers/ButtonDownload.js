import { connect } from 'react-redux'
import { downloadVideos } from 'ducks/videos'
import Button from 'components/Shared/Button'

const mapStateToProps = (state) => ({
  badge: (state.videos.result.filter(uuid => state.videos.entities[uuid].selected).length ? state.videos.result.filter(uuid => state.videos.entities[uuid].selected).length:null),
  progress: (!state.context.downloading ? 0 : state.videos.result.map(uuid => state.videos.entities[uuid]).filter(video => video.selected).map(video => video.progress).reduce((accumulator, progress) => accumulator + progress, 0) / state.videos.result.filter(uuid => state.videos.entities[uuid].selected).length),
  children: (state.context.downloading ? 'Cancel':(state.videos.result.filter(uuid => state.videos.entities[uuid].selected).length ? 'Download selection':'Select some videos')),
  disabled: (!state.videos.result.filter(uuid => state.videos.entities[uuid].selected).length)
})

const mapDispatchToProps = (dispatch) => ({
  onClick: () => {
    dispatch(downloadVideos())
  }
})

const ButtonDownload = connect(
  mapStateToProps,
  mapDispatchToProps
)(Button)

export default ButtonDownload
