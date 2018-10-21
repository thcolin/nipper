import { connect } from 'react-redux'
import { buildLink, destructLink } from 'store/services/youtube'
import { initApi } from 'store/ducks/api'
import { doDig, clearDigger } from 'store/ducks/digger'
import { clearSelection } from 'store/ducks/selection'
import { tapeToast, clearToaster } from 'store/ducks/toaster'
import Form from 'components/Form'

export default connect(
  (state) => {
    const current = Object.values(state.digger).pop() || {}
    const dig = {
      done: true,
      ...current,
      url: current.uri ? buildLink(current.uri) : ''
    }

    if (state.api.broken) {
      return {
        value: dig.url,
        ready: false,
        label: 'Retry',
        icon: 'warning'
      }
    } else if (!state.api.ready) {
      return {
        value: dig.url,
        ready: false,
        disabled: true,
        label: 'Loading...',
        icon: 'loading',
        animate: true
      }
    } else if (!dig.done) {
      return {
        value: dig.url,
        ready: false,
        label: 'Cancel',
        icon: 'loading',
        animate: true
      }
    } else {
      return {
        value: dig.url
      }
    }
  },
  null,
  (state, { dispatch }, props) => ({
    ...props,
    ...state,
    onSubmit: (value) => {
      if (state.label === 'Retry') {
        dispatch(initApi())
      } else if (state.label === 'Cancel') {
        dispatch(clearDigger())
      } else {
        try {
          dispatch(clearDigger())
          dispatch(clearToaster())
          dispatch(clearSelection())
          dispatch(doDig(destructLink(value).uri))
        } catch (e) {
          dispatch(tapeToast('error', e, 'doDig', true))
        }
      }
    }
  })
)(Form)
