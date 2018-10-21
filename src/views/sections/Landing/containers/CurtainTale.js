import React from 'react'
import { connect } from 'react-redux'
import Curtain from 'components/blocks/Curtain'
import TaleRecord from './TaleRecord'

export default connect(
  (state, props) => ({
    children: (state.api.ready ? Object.values(state.library) : [])
      .filter(playlist => playlist.kind === 'playlist')
      .sort((a, b) => b.latest - a.latest)
      .map(playlist => <TaleRecord uri={playlist.uri} />)
      .slice(0, 15)
  }),
  (dispatch) => ({

  })
)(Curtain)
