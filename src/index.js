import React from 'react'
import ReactDOM from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { Provider } from 'react-redux'
import App from 'views/App'
import { reducer, epic } from 'ducks'
import { initApp } from 'ducks/app'
import xhook from 'xhook'
import 'utils/polyfill'

xhook.before(request => {
  if(request.url.match(/youtu\.?be(\.com)?|ytimg\.com|googlevideo\.com/)){
    request.url = '/proxify?url=' + btoa(request.url)
  }
})

const composeEnhancers = (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      createEpicMiddleware(epic)
    )
  )
)

store.dispatch(initApp())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('mount')
)
