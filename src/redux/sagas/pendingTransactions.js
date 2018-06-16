import { all, takeLatest } from 'redux-saga/effects'
import store from 'redux/store'

import localServices from 'lib/feathers/local/feathersServices'

function * createPendingTransaction ({ transactionHash, method, from, to }) {
  yield store.dispatch(localServices.pendingTransaction.create({ transactionHash, method, from, to }))
}

export default function * watchAuth () {
  yield all([
    takeLatest('WALLET_TRANSACTION_SUCCESS', createPendingTransaction)
  ])
}
