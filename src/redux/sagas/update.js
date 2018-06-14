import { all, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import request from 'superagent'

import store from 'redux/store'

function * update () {
  try {
    if (!window.localStorage || !window.localStorage.getItem) {
      throw new Error('No localStorage!')
    }
    const accessToken = window.localStorage.getItem('local-feathers-jwt')
    yield request
      .post('/update-api/update')
      .send()
      .set('Authorization', accessToken)

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
