import React from 'react'
import { connect } from 'react-redux'
import { selectVideos } from 'ducks/videos'
import Toggle from 'components/Shared/Toggle'

const mapStateToProps = (state) => ({
  toggled: (!!state.videos.result.length && state.videos.result.length === state.videos.result.filter(id => state.videos.entities[id].selected).length),
  disabled: (state.context.downloading || !state.videos.result.length)
})

const mapDispatchToProps = (dispatch) => ({
  onToggle: (to) => {
    dispatch(selectVideos(to))
  }
})

const ToggleVideoSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toggle)

export default ToggleVideoSelect
