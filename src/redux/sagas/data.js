import { all, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import store from 'redux/store'
import request from 'superagent'

import localServices from 'lib/feathers/local/feathersServices'

function * fetch ({ model }) {
  const { page, sort, search, router } = store.getState()

  const tokenAddress = router.location.pathname.split('/')[2]

  const $sort = sort[model]
  const $skip = page[model] * 25

  const query = model === 'shareholders'
    ? { 'ethAddresses.issues.address': tokenAddress, $sort, $skip }
    : { contractAddress: tokenAddress, $sort, $skip }

  if (search[model]) { query.search = search[model] }

  const { value } = yield store.dispatch(localServices[model.replace(/s$/, '')].find({ query }))

  if (!value.data[0] && value.total && $skip > 0) {
    const firstPageQuery = Object.assign({}, query, { $skip: 0 })
    yield store.dispatch(localServices[model.replace(/s$/, '')].find({ query: firstPageQuery }))
  }
}

// const delay = (ms) => new Promise(res => setTimeout(res, ms))

function * update () {
  try {
    // Request update
    const res = yield request
      .post(`${window.location.hostname}:3001/update`)
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
    takeLatest('SET_PAGE', fetch),
    takeLatest('SET_SORT', fetch),
    takeLatest('SET_SEARCH', fetch),
    takeLatest('UPDATE', update)
  ])
}
