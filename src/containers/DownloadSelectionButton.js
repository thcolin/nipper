import { connect } from 'react-redux'
import { setDownloading, downloadSelection } from 'actions'
import Button from 'components/Shared/Button'

const mapStateToProps = (state) => ({
  children: (
    state.videos.filter(e => e.selected).length ? (
      state.downloading ?
      'Downloading Selection'
      :
      'Download Selection'
    )
    :
    'Select some videos'
  ),
  disabled: (state.downloading || !state.videos.filter(e => e.selected).length)
})

const mapDispatchToProps = (dispatch) => ({
  onClick: () => {
    dispatch(setDownloading(true))
    dispatch(downloadSelection())
  }
})

const DownloadSelectionButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(Button)

export default DownloadSelectionButton
