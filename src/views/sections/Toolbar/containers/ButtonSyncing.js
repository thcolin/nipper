import { connect } from 'react-redux'
import Button from 'components/atoms/Button'

export default connect(
  (state) => {
    const { synced, total } = state.library[Object.keys(state.digger).pop()] || { synced: 0, total: 0 }

    return {
      title: `Syncing: ${synced} / ${total}`
    }
  },
  (dispatch) => ({

  })
)(Button)
