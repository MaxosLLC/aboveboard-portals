import { all, fork } from 'redux-saga/effects'
import watchAuth from 'redux/sagas/auth'
import watchData from 'redux/sagas/data'

export default function * rootSaga () {
  yield all([
    fork(watchAuth),
    fork(watchData)
  ])
}
