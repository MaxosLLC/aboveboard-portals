import { all, takeLatest } from 'redux-saga/effects'

import ethereum from 'lib/ethereum'

function * checkCurrentNetwork () {
  const currentNetwork = yield ethereum.getCurrentNetwork()
  console.log('cn ', currentNetwork)
}

export default function * watchAuth () {
  yield all([
    takeLatest('ETHEREUM_CONNECTED', checkCurrentNetwork)
  ])
}
