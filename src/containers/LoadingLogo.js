import { connect } from 'react-redux'
import Logo from 'components/Shared/Logo'

const mapStateToProps = (state, ownProps) => ({
  animate: (!state.analyze.paused && state.analyze.total !== null && ((Object.keys(state.videos).length + Object.keys(state.errors).length) !== state.analyze.total))
})

const LoadingLogo = connect(
  mapStateToProps,
  (dispatch, ownProps) => ownProps
)(Logo)

export default LoadingLogo
