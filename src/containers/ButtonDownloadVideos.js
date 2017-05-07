import { connect } from 'react-redux'
import { downloadVideos } from 'ducks/videos'
import Button from 'components/Shared/Button'

const mapStateToProps = (state) => ({
  icon: (state.context.downloading ? 'fa-circle-o-notch fa-spin fa-fw':''),
  badge: (Object.keys(state.videos).filter(id => state.videos[id].selected).length ? Object.keys(state.videos).filter(id => state.videos[id].selected).length:null),
  progress: (!state.context.downloading ? 0 : Object.keys(state.videos).map(id => state.videos[id]).filter(video => video.selected).map(video => video.progress).reduce((accumulator, progress) => accumulator + progress, 0) / Object.keys(state.videos).filter(id => state.videos[id].selected).length),
  children: (state.context.downloading ? 'Cancel':(Object.keys(state.videos).filter(id => state.videos[id].selected).length ? 'Download Selection':'Select some videos')),
  disabled: (!Object.keys(state.videos).filter(id => state.videos[id].selected).length)
})

const mapDispatchToProps = (dispatch) => ({
  onClick: () => {
    dispatch(downloadVideos())
  }
})

const ButtonDownloadVideos = connect(
  mapStateToProps,
  mapDispatchToProps
)(Button)

export default ButtonDownloadVideos
