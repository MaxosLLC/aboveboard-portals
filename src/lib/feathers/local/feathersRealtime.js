import client from 'lib/feathers/local/feathersClient'
import localServices from 'lib/feathers/local/feathersServices'
import store from 'redux/store'

const tokenDetailRegexp = /^\/tokens\/[a-zA-Z0-9]+\/detail$/
const shareholderDetailRegexp = /^\/tokens\/[a-zA-Z0-9]+\/shareholders\/[a-zA-Z0-9-]+\/detail$/

const getCurrentQueryParams = model => {
  const { page, sort, search } = store.getState()

  const params = { $skip: page[model] * 25, $sort: sort[model] }

  if (search[model]) { params.search = search[model] }

  return params
}

export default {
  init () {
    // Watch user profile changes
    client.service('user').on('patched', user => store.dispatch({ type: 'SET_CURRENT_USER', user: user.data || user }))

    client.service('shareholder').on('created', data => {
      if (tokenDetailRegexp.test(window.location.pathname)) {
        const { $skip, $sort, search } = getCurrentQueryParams('shareholders')
        const address = window.location.pathname.split('/')[2]

        store.dispatch(localServices.shareholder.find({ query: { 'ethAddresses.issues.address': address, search, $skip, $sort } }))
      }
    })
    client.service('shareholder').on('patched', data => {
      if (tokenDetailRegexp.test(window.location.pathname)) {
        const { $skip, $sort, search } = getCurrentQueryParams('shareholders')
        const address = window.location.pathname.split('/')[2]

        store.dispatch(localServices.shareholder.find({ query: { 'ethAddresses.issues.address': address, search, $skip, $sort } }))
      }

      if (shareholderDetailRegexp.test(window.location.pathname)) {
        const id = window.location.pathname.split('/')[4]

        store.dispatch(localServices.shareholder.find({ query: { id, $limit: 1 } }))
      }
    })
    client.service('transaction').on('created', data => {
      if (tokenDetailRegexp.test(window.location.pathname)) {
        const { $skip, $sort, search } = getCurrentQueryParams('transactions')
        const contractAddress = window.location.pathname.split('/')[2]

        store.dispatch({ type: 'INCREMENT_TOTAL_TRANSACTIONS', contractAddress })
        store.dispatch(localServices.transaction.find({ query: { contractAddress, search, $skip, $sort } }))
      }
    })
    client.service('localToken').on('patched', data => {
      if (tokenDetailRegexp.test(window.location.pathname)) {
        const address = window.location.pathname.split('/')[2]

        store.dispatch(localServices.localToken.find({ query: { address } }))
      }
    })
  }
}
