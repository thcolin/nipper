import { connect } from 'react-redux'
import Logo from 'components/Shared/Logo'

const mapStateToProps = (state, ownProps) => ({
  animate: (!state.context.paused && state.context.total !== null && ((Object.keys(state.videos).length + Object.keys(state.errors).length) !== state.context.total))
})

const LogoAnimated = connect(
  mapStateToProps,
  (dispatch, ownProps) => ownProps
)(Logo)

export default LogoAnimated
