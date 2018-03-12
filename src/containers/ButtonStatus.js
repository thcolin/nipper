import { connect } from 'react-redux'
import Button from 'components/Button'

const mapStateToProps = (state, ownProps) => {
  var props = Object.assign({}, ownProps)

  props.children = (state.videos.result.length + state.errors.result.length) + ' / ' + state.context.total

  return props
}

const ButtonStatus = connect(
  mapStateToProps,
  () => ({})
)(Button)

export default ButtonStatus
