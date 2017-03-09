import React from 'react'
import { connect } from 'react-redux'

const SelectionText = (state) => {
  return(
    <div>
      {(!state.videos.filter(e => e.selected).length) ?
        <p>You need to select at least one video to download a selection</p>
        :
        <p>You're about to convert and download <strong>{state.videos.filter(e => e.selected).length}</strong> videos</p>
      }
    </div>
  )
}

export default connect(state => state)(SelectionText)
