import { connect } from 'react-redux'
import { setDownloading, downloadSelection } from 'actions'
import Button from 'components/Shared/Button'

const mapStateToProps = (state) => ({
  children: (state.downloading ? 'Downloading Selection':'Download Selection'),
  disabled: (state.downloading || !state.videos.filter(e => e.selected).length)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(setDownloading(true))
    dispatch(downloadSelection(ownProps.filter))
  }
})

const DownloadSelectionButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(Button)

export default DownloadSelectionButton
