import React from 'react'
import { connect } from 'react-redux'
import Message from 'components/blocks/Message'

const Wrapper = ({ display, ...props }) => (display ? <Message {...props} /> : null)

export default connect(
  (state) => {
    const errors = (state.library[Object.keys(state.digger).pop()] || { tracks: [] })
      .tracks
      .filter(track => track.split('#')[1] === 'error')
      .length

    return {
      display: errors,
      children: <span>Hmm.. Something went wrong for <strong>{errors}</strong> videos, {errors > 1 ? 'they' : 'it'} seems <strong>unavailable</strong> for some reason</span>
    }
  },
  (dispatch) => ({

  })
)(Wrapper)
