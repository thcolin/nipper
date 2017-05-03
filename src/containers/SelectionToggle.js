import React from 'react'
import { connect } from 'react-redux'
import { selectVideos } from 'ducks/videos'
import Toggle from 'components/Shared/Toggle'

const mapStateToProps = (state) => ({
  toggled: (Object.keys(state.videos).length === Object.keys(state.videos).filter(id => state.videos[id].selected).length),
  disabled: (state.analyze.downloading || !Object.keys(state.videos).length)
})

const mapDispatchToProps = (dispatch) => ({
  onToggle: (to) => {
    dispatch(selectVideos(to))
  }
})

const SelectionToggle = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toggle)

export default SelectionToggle
