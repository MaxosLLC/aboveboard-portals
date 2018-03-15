import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'react-router-redux'
import rootSaga from 'redux/sagas'
import reducer from './reducer'
import history from 'redux/history'

import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'

const sagaMiddleware = createSagaMiddleware()

const historyMiddleware = routerMiddleware(history)

const store = createStore(
  reducer,
  applyMiddleware(thunk, promiseMiddleware(), sagaMiddleware, historyMiddleware)
)

sagaMiddleware.run(rootSaga)

export default store
