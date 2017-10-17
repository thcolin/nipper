import React from 'react'
import ReactDOM from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { Provider } from 'react-redux'
import Web from 'components/App/Web'
import { reducer, epic } from 'ducks'
import xhook from 'xhook'
import 'utils/polyfill'
import 'utils/rxjs' // init custom observables and operators

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

ReactDOM.render(
  <Provider store={store}>
    <Web />
  </Provider>,
  document.getElementById('mount')
)
