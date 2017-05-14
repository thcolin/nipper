import { connect } from 'react-redux'
import { togglePause } from 'ducks/context'
import Button from 'components/Shared/Button'

const mapStateToProps = (state, ownProps) => {
  var props = Object.assign({}, ownProps)

  props.children = state.videos.result.length + ' / ' + state.context.total
  props.icon = { label: ownProps.icon }

  if(state.context.paused){
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

const ButtonStatus = connect(
  mapStateToProps,
  mapDispatchToProps
)(Button)

export default ButtonStatus
