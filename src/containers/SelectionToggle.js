import React from 'react'
import { connect } from 'react-redux'
import { toggleVideos } from 'actions'
import Toggle from 'components/Shared/Toggle'

const mapStateToProps = (state) => {
  return {
    toggled: (state.videos.length === state.videos.filter(e => e.selected).length),
    disabled: (state.downloading || !state.videos.length)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (to) => {
      dispatch(toggleVideos(to))
    }
  }
}

const SelectionToggle = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toggle)

export default SelectionToggle
