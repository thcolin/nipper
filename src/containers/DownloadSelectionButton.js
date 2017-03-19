import { connect } from 'react-redux'
import { downloadSelection } from 'actions'
import Button from 'components/Shared/Button'

const mapStateToProps = (state) => ({
  badge: (state.videos.filter(e => e.selected).length ? state.videos.filter(e => e.selected).length:null),
  children: (state.videos.filter(e => e.selected).length ? 'Download Selection':'Select some videos'),
  disabled: (!state.videos.filter(e => e.selected).length)
})

const mapDispatchToProps = (dispatch) => ({
  onClick: () => {
    dispatch(downloadSelection())
  }
})

const DownloadSelectionButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(Button)

export default DownloadSelectionButton
