import { all, fork } from 'redux-saga/effects'
import watchAuth from 'redux/sagas/auth'
import watchData from 'redux/sagas/data'
import pendingTransactions from 'redux/sagas/pendingTransactions'
import watchEthereumNetworkChecker from 'redux/sagas/ethereumNetworkChecker'
import watchUpdate from 'redux/sagas/update'

export default function * rootSaga () {
  yield all([
    fork(watchAuth),
    fork(watchData),
    fork(pendingTransactions),
    fork(watchEthereumNetworkChecker),
    fork(watchUpdate)
  ])
}
