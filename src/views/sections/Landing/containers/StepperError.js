import { connect } from 'react-redux'
import Stepper from 'components/blocks/Stepper'

export default connect(
  (state, props) => {
    const toasts = Object.values(state.toaster)
      .filter(toast => toast.type === 'error')
      .filter(toast => toast.clue === 'doDig')
      .map((toast, index) => ({ key: index, emoji: '⚠️', label: toast.children }))

    return {
      children: toasts.length ? toasts : props.children
    }
  },
  (dispatch) => ({

  })
)(Stepper)
