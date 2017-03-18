import { connect } from 'react-redux'
import { togglePause } from 'actions'
import Button from 'components/Shared/Button'

const mapStateToProps = (state, ownProps) => {
  var props = Object.assign({}, ownProps)

  props.children = state.videos.length + ' / ' + state.analyze.total
  props.icon = { label: ownProps.icon }

  if(state.analyze.pause){
    props.icon.style = {
      animationPlayState: 'paused'
    }
  }

  return props
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(togglePause())
  }
})

const LoadingButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(Button)

export default LoadingButton
