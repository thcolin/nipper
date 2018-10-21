import { connect } from 'react-redux'

const Wrapper = ({ children, ...props }) => children(props)

export default connect(
  (state) => ({
    ongoing: !!Object.keys(state.digger).length,
    done: (Object.values(state.digger).pop() || { done: false }).done,
    empty: !(state.library[Object.keys(state.digger).pop()] || { tracks: [] })
      .tracks
      .filter(track => track.split('#')[1] === 'track')
      .length
  }),
  (dispatch) => ({

  })
)(Wrapper)
