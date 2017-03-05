import { connect } from 'react-redux'
import { downloadSelection } from 'actions'
import Button from 'components/Shared/Button'

const mapStateToProps = (state, ownProps) => ({
  // disabled: ownProps.filter === state.visibilityFilter
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(downloadSelection(ownProps.filter))
  }
})

const DownloadSelectionButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(Button)

export default DownloadSelectionButton
