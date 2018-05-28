import { all, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import store from 'redux/store'
import request from 'superagent'

function * update () {
  try {
    // Request update
    yield request
      .post(`${window.location.hostname}/update-api`)
      .send()

    // Give 1 second timeout
    yield delay(1000)

    // reload page
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
