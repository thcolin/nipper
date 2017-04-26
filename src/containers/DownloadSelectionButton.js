import { connect } from 'react-redux'
import { downloadSelection } from 'ducks/videos'
import Button from 'components/Shared/Button'

const mapStateToProps = (state) => ({
  icon: (state.analyze.process ? 'fa-circle-o-notch fa-spin fa-fw':''),
  badge: (Object.keys(state.videos).filter(id => state.videos[id].selected).length ? Object.keys(state.videos).filter(id => state.videos[id].selected).length:null),
  children: (state.analyze.process ? 'Downloading':(Object.keys(state.videos).filter(id => state.videos[id].selected).length ? 'Download Selection':'Select some videos')),
  disabled: (!Object.keys(state.videos).filter(id => state.videos[id].selected).length)
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
