import { connect } from 'react-redux'
import { togglePause } from 'actions'
import Logo from 'components/Shared/Logo'

const mapStateToProps = (state, ownProps) => ({
  animate: (state.analyze.id && !state.analyze.pause && state.analyze.token !== null)
})

const LoadingLogo = connect(
  mapStateToProps,
  (dispatch, ownProps) => ownProps
)(Logo)

export default LoadingLogo
