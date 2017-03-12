import { connect } from 'react-redux'
import { toggleLoading } from 'actions'
import Button from 'components/Shared/Button'

const mapStateToProps = (state, ownProps) => {
  var props = Object.assign({}, ownProps)

  props.children = state.videos.length + ' / 1273'
  props.icon = { label: ownProps.icon }

  if(!state.job.loading){
    props.icon.style = {
      animationPlayState: 'paused'
    }
  }

  return props
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(toggleLoading())
  }
})

const LoadingButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(Button)

export default LoadingButton
