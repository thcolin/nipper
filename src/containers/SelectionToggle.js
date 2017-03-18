import React from 'react'
import { connect } from 'react-redux'
import { shiftVideos } from 'actions'
import Toggle from 'components/Shared/Toggle'

const mapStateToProps = (state) => {
  return {
    toggled: (state.videos.length === state.videos.filter(v => v.selected).length),
    disabled: (!state.videos.length)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (to) => {
      dispatch(shiftVideos(to))
    }
  }
}

const SelectionToggle = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toggle)

export default SelectionToggle
