import VirtuaList from 'react-virtualist'
import { connect } from 'react-redux'

export default connect(
  (state) => ({
    items: (state.library[Object.keys(state.digger).pop()] || { tracks: [] })
      .tracks
      .filter(track => track.split('#')[1] === 'track')
  }),
  (disaptch) => ({

  })
)(VirtuaList)
