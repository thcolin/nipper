import React from 'react'
import ReactDOM from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { Provider } from 'react-redux'
import App from 'components/App'
import { reducer, epic } from 'ducks'
import config from 'config'
import xhook from 'xhook'
import 'utils/rxjs' // init custom observables and operators

const composeEnhancers = (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      createEpicMiddleware(epic)
    )
  )
)

if(config.universal){
  // TODO : should call the server on the same port, to be just be /proxify?url
  xhook.before((request) => {
    if(request.url.match(/youtu\.?be(\.com)?|ytimg\.com|googlevideo\.com/)){
      request.url = 'http://localhost:3000/proxify?url=' + btoa(request.url)
    }
  })
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('mount')
)
