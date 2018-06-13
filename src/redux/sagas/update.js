import { all, takeLatest, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import localServices from 'lib/feathers/local/feathersServices'

import store from 'redux/store'

function * update () {
  try {
    const currentUser = yield select(s => s.currentUser)
    yield store.dispatch(localServices.user.patch(currentUser._id, {
      updating: true
    }))
    // Wait for 10 seconds
    yield delay(10000)
    window.location.reload()
  } catch (e) {
    console.error(e)
    store.dispatch({
      type: 'UPDATE_FAILED'
    })

    window.alert('Failed to update!')
  }
}

export default function * watchAuth () {
  yield all([
    takeLatest('UPDATE', update)
  ])
}
