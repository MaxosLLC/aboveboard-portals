import { all, takeLatest } from 'redux-saga/effects'
import store from 'redux/store'

import localServices from 'lib/feathers/local/feathersServices'

function * createPendingTransaction ({ transactionHash, methodHex, method, from, to, estimatedGasLimit }) {
  yield store.dispatch(localServices.pendingTransaction.create({ transactionHash, methodHex, method, from, to, estimatedGasLimit }))
}

export default function * watchAuth () {
  yield all([
    takeLatest('WALLET_TRANSACTION_SUCCESS', createPendingTransaction)
  ])
}
