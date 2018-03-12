import { connect } from 'react-redux'
import Logo from 'components/Logo'

const mapStateToProps = (state, ownProps) => ({
  animate: (!state.context.paused && state.context.total !== null && ((state.videos.result.length + state.errors.result.filter(uuid => state.errors.entities[uuid].origin === 'context').length) !== state.context.total))
})

const LogoAnimatable = connect(
  mapStateToProps,
  () => ({})
)(Logo)

export default LogoAnimatable
