import { createStore, applyMiddleware } from 'redux'
import Immutable from 'immutable'
import thunkMiddleware from 'redux-thunk'
import apiMiddleware from '../middleware/api'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import * as utils from 'lib/util'

const logger = createLogger({
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: (getState, action) => true
})

let middlewares = [
  thunkMiddleware,
  apiMiddleware
];

if (process.env.NODE_ENV !== 'production') {
  middlewares = [...middlewares, logger]
}

const createStoreWithMiddleware = applyMiddleware(
  ...middlewares
)(createStore);

export default function configureStore(initialState) {
  const args = [rootReducer, initialState]
  if (utils.canUseDom() && window.__REDUX_DEVTOOLS_EXTENSION__) {
    args.push(
      window.__REDUX_DEVTOOLS_EXTENSION__({
        serialize: {
          immutable: Immutable
        }
      })
    )
  }
  const store = createStoreWithMiddleware(...args);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
