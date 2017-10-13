import { connect } from 'react-redux'
import Logo from 'components/Shared/Logo'

const mapStateToProps = (state, ownProps) => ({
  animate: (!state.context.paused && state.context.total !== null && ((state.videos.result.length + state.errors.result.filter(uuid => state.errors.entities[uuid].origin === 'context').length) !== state.context.total))
})

const LogoAnimated = connect(
  mapStateToProps,
  (dispatch, ownProps) => ownProps
)(Logo)

export default LogoAnimated
