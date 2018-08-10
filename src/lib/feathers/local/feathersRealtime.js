import client from 'lib/feathers/local/feathersClient'
import cloudServices from 'lib/feathers/cloud/feathersServices'
import localServices from 'lib/feathers/local/feathersServices'
import store from 'redux/store'
import { throttle } from 'lodash'

import ethereum from 'lib/ethereum'

const tokenDetailRegexp = /^\/tokens\/[a-zA-Z0-9]+\/detail$/
const shareholderDetailRegexp = /^\/tokens\/[a-zA-Z0-9]+\/shareholders\/[a-zA-Z0-9-]+\/detail$/
const pendingTransactionsRegexp = /^\/pending-transactions/

const throttleThreshold = 5000 // 5 seconds

const getCurrentQueryParams = model => {
  const { page, sort, search } = store.getState()

  const params = { $skip: page[model] * 25, $sort: sort[model] }

  if (search[model]) { params.search = search[model] }

  return params
}

const updateWhitelists = async () => {
  const user = store.getState().currentUser
  const allLocalTokens = await localServices.localToken.find()
  const { data: allLocalTokensData } = await allLocalTokens.payload.promise
  const allWhitelists = await cloudServices.whitelist.find()
  const { data: allWhitelistsData } = await allWhitelists.payload.promise
  const whitelists = await ethereum.getWhitelistsForBroker(allWhitelistsData, user, allLocalTokensData)
console.log('updating whitelists ', whitelists)
  return store.dispatch(cloudServices.whitelist.find({ query: { address: { $in: whitelists } } }))
}

export default {
  init () {
    // Watch for user profile changes
    client.service('user').on('patched', user => store.dispatch({ type: 'SET_CURRENT_USER', user: user.data || user }))

    client.service('investor').on('created', throttle(async data => {
      if (tokenDetailRegexp.test(window.location.pathname)) {
        const { $skip, $sort, search } = getCurrentQueryParams('investors')
        const contractAddress = window.location.pathname.split('/')[2]

        const result = await localServices.investor.find({ query: { 'ethAddresses.issues.address': contractAddress, $limit: 0 } })
        const { total: shareholders } = await result.payload.promise
        store.dispatch({ type: 'SET_TOTAL_SHAREHOLDERS', contractAddress, shareholders })

        store.dispatch(localServices.investor.find({ query: { 'ethAddresses.issues.address': contractAddress, search, $skip, $sort } }))
      }
    }, throttleThreshold))

    client.service('investor').on('patched', throttle(async data => {
      if (tokenDetailRegexp.test(window.location.pathname)) {
        const { $skip, $sort, search } = getCurrentQueryParams('investors')
        const contractAddress = window.location.pathname.split('/')[2]

        const result = await localServices.investor.find({ query: { 'ethAddresses.issues.address': contractAddress, $limit: 0 } })
        const { total: shareholders } = await result.payload.promise
        store.dispatch({ type: 'SET_TOTAL_SHAREHOLDERS', contractAddress, shareholders })

        store.dispatch(localServices.investor.find({ query: { 'ethAddresses.issues.address': contractAddress, search, $skip, $sort } }))
      }

      if (shareholderDetailRegexp.test(window.location.pathname)) {
        const id = window.location.pathname.split('/')[4]

        store.dispatch(localServices.investor.find({ query: { id, $limit: 1 } }))
      }
    }, throttleThreshold))

    client.service('transaction').on('created', throttle(async data => {
      if (tokenDetailRegexp.test(window.location.pathname)) {
        const { $skip, $sort, search } = getCurrentQueryParams('transactions')
        const contractAddress = window.location.pathname.split('/')[2]

        const result = await localServices.transaction.find({ query: { contractAddress, $limit: 0 } })
        const { total: tokens } = await result.payload.promise
        store.dispatch({ type: 'SET_TOTAL_TRANSACTIONS', contractAddress, tokens })

        store.dispatch(localServices.transaction.find({ query: { contractAddress, search, $skip, $sort } }))

        const { $skip: $skipInvestors, $sort: $sortInvestors, search: searchInvestors } = getCurrentQueryParams('investors')
        store.dispatch(localServices.investor.find({ query: { 'ethAddresses.issues.address': contractAddress, search: searchInvestors, $skip: $skipInvestors, $sort: $sortInvestors } }))
      }
    }, throttleThreshold))

    client.service('pendingTransaction').on('created', throttle(async data => {
      if (pendingTransactionsRegexp.test(window.location.pathname)) {
        const { $skip, $sort, search } = getCurrentQueryParams('pendingTransactions')
        store.dispatch(localServices.transaction.find({ query: { search, $skip, $sort } }))
      }
    }, throttleThreshold))

    client.service('pendingTransaction').on('patched', throttle(async data => {
      if (pendingTransactionsRegexp.test(window.location.pathname)) {
        const { $skip, $sort, search } = getCurrentQueryParams('pendingTransactions')
        store.dispatch(localServices.transaction.find({ query: { search, $skip, $sort } }))
      }
    }, throttleThreshold))

    client.service('localToken').on('created', async data => {
      console.log('created')
      if (tokenDetailRegexp.test(window.location.pathname)) {
        const address = window.location.pathname.split('/')[2]

        store.dispatch(localServices.localToken.find({ query: { address } }))
      }

      return updateWhitelists()
    })
    client.service('localToken').on('patched', async data => {
      if (tokenDetailRegexp.test(window.location.pathname)) {
        const address = window.location.pathname.split('/')[2]

        store.dispatch(localServices.localToken.find({ query: { address } }))
      }
    })
    client.service('localToken').on('removed', async data => console.log('remove') || updateWhitelists())
  }
}
