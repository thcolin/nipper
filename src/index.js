import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from 'views/App'
import store from 'store'
import 'utils/hooks'
import 'utils/polyfill'
import 'styles'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('mount')
)
