import marksy from 'marksy'
import uuidv4 from 'uuid/v4'
import bootstrap from 'more/marksy'

const marksify = marksy(bootstrap)

// Actions
export const TAPE = 'nipper/toaster/TAPE'
export const REMOVE = 'nipper/toaster/REMOVE'
export const CLEAR = 'nipper/toaster/CLEAR'

// Reducer
const initial = {
  // '30fff21e-469a-437c-8cd4-483a9348ad15': {
  //   type: 'error',
  //   uuid: '30fff21e-469a-437c-8cd4-483a9348ad15',
  //   children: 'Hello World !',
  //   clue: 'anything',
  // },
}

export default function reducer (state = initial, action = {}) {
  switch (action.type) {
    case TAPE:
      return {
        ...state,
        [action.toast.uuid]: action.toast
      }
    case REMOVE:
      return Object.values(state)
        .filter(toast => action.uuid !== toast.uuid)
        .reduce((toasts, toast) => ({ ...toasts, [toast.uuid]: toast }), {})
    case CLEAR:
      return initial
    default:
      return state
  }
}

// Actions Creators
export const tapeToast = (type, children, clue = null, markdown = false) => ({
  type: TAPE,
  toast: {
    uuid: uuidv4(),
    type,
    children: markdown ? marksify(children.toString()).tree : children,
    clue
  }
})

export const removeToast = (uuid) => ({
  type: REMOVE,
  uuid
})

export const clearToaster = () => ({
  type: CLEAR
})
