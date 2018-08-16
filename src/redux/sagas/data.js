import { all, takeLatest } from 'redux-saga/effects'
import store from 'redux/store'

import cloudServices from 'lib/feathers/cloud/feathersServices'
import localServices from 'lib/feathers/local/feathersServices'

function * fetch ({ model }) {
  const service = model === 'whitelists' ? cloudServices : localServices
  const { page, sort, search, router } = store.getState()

  const tokenAddress = router.location.pathname.split('/')[2]

  const $sort = sort[model]
  const $skip = page[model] * 25

  const query = model === 'investors'
    ? { 'ethAddresses.issues.address': tokenAddress, $sort, $skip }
    : { contractAddress: tokenAddress, $sort, $skip }

  if (search[model]) { query.search = search[model] }

  const { value } = yield store.dispatch(service[model.replace(/s$/, '')].find({ query }))

  if (!value.data[0] && value.total && $skip > 0) {
    const firstPageQuery = Object.assign({}, query, { $skip: 0 })
    yield store.dispatch(service[model.replace(/s$/, '')].find({ query: firstPageQuery }))
  }
}

export default function * watchAuth () {
  yield all([
    takeLatest('SET_PAGE', fetch),
    takeLatest('SET_SORT', fetch),
    takeLatest('SET_SEARCH', fetch)
  ])
}
