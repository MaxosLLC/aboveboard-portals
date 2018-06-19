import { all, takeLatest } from 'redux-saga/effects'
import store from 'redux/store'

import localServices from 'lib/feathers/local/feathersServices'
import ethereum from 'lib/ethereum'

function * createPendingTransaction ({ transactionHash, methodHex, from, to, estimatedGasLimit }) {
  const method = ethereum.methodByHex[methodHex]
  yield store.dispatch(localServices.pendingTransaction.create({ transactionHash, methodHex, method, from, to, estimatedGasLimit }))
}

export default function * watchAuth () {
  yield all([
    takeLatest('WALLET_TRANSACTION_SUCCESS', createPendingTransaction)
  ])
}
