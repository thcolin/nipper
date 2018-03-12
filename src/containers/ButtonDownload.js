import { connect } from 'react-redux'
import { downloadVideos } from 'ducks/videos'
import Button from 'components/Button'

const mapStateToProps = (state) => {
  var badge, progress, children, disabled

  const selection = state.videos.result
    .map(uuid => state.videos.entities[uuid])
    .filter(video => video.selected)

  badge = (selection.length > 0 ? selection.length : null)
  progress = !state.context.downloading ? 0 : selection
    .map(video => video.progress)
    .reduce((accumulator, progress) => accumulator + progress, 0) / selection.length
  disabled = !selection.length

  if (state.context.downloading) {
    children = (progress === 100 ? 'Zipping...' : 'Cancel')
  } else {
    children = (selection.length ? 'Download selection' : 'Select some videos')
  }

  return {
    badge,
    progress,
    children,
    disabled
  }
}

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
