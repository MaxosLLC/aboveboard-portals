import { all, takeLatest } from 'redux-saga/effects'

import ethereum from 'lib/ethereum'
import store from 'redux/store'

function * checkCurrentNetwork () {
  const currentNetwork = yield ethereum.getCurrentNetwork()

  if (+currentNetwork !== 42 && /kovan/.test(window.location.hostname)) {
    store.dispatch({ type: 'WALLET_TRANSACTION_START', method: 'changeToKovanNetwork' })
  }
}

export default function * watchAuth () {
  yield all([
    takeLatest('ETHEREUM_CONNECTED', checkCurrentNetwork)
  ])
}
