import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import App from 'components/App'
import reducer from 'reducers'
import config from 'config'
import xhook from 'xhook'

const store = createStore(
  reducer,
  // useful only in develop
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
)

if(config.universal){
  // TODO : should call the server on the same port, to be just be /proxify?url
  xhook.before((request) => {
    request.url = 'http://localhost:3000/proxify?url=' + btoa(request.url)
  })
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('mount')
)
