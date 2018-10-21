import { connect } from 'react-redux'
import Button from 'components/atoms/Button'
import { insertSelection, removeSelection } from 'store/ducks/selection'

export default connect(
  (state) => {
    const disabled = !!Object.keys(state.downloader.zip || {}).length
    const tracks = (state.library[Object.keys(state.digger).pop()] || { tracks: [] })
      .tracks
      .filter(track => track.split('#')[1] === 'track')

    const crumbs = {
      tracks
    }

    if (tracks.length === state.selection.length) {
      return {
        title: 'Unselect All',
        appearance: 'plain',
        disabled,
        crumbs: {
          ...crumbs,
          behavior: false
        }
      }
    } else {
      return {
        title: 'Select All',
        appearance: 'light',
        disabled,
        crumbs: {
          ...crumbs,
          behavior: true
        }
      }
    }
  },
  null,
  ({ crumbs, ...state }, { dispatch }, props) => ({
    ...props,
    ...state,
    onClick: () => {
      if (crumbs.behavior) {
        dispatch(insertSelection(crumbs.tracks))
      } else {
        dispatch(removeSelection(crumbs.tracks))
      }
    }
  })
)(Button)
