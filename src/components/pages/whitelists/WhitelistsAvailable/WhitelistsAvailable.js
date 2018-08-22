import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import cloudServices from 'lib/feathers/cloud/feathersServices'
import localServices from 'lib/feathers/local/feathersServices'
import ethereum from 'lib/ethereum'
import store from 'redux/store'
import WhitelistsAvailableView from './WhitelistsAvailableView'

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  whitelists: state.whitelist.queryResult ? state.whitelist.queryResult.data : [],
  localTokens: state.localToken.queryResult ? state.localToken.queryResult.data : [],
  page: state.page.whitelists,
  search: state.search.whitelists,
  queryResult: {
    whitelists: state.whitelist.queryResult || { total: 0, limit: 0 }
  },
  loaded: state.whitelist.isFinished && state.localToken.isFinished
})

const mapDispatchToProps = dispatch => {
  return {
    routeTo (path) { dispatch(push(path)) },
    loadLocalTokens: () => dispatch(localServices.localToken.find()),
    loadWhitelists: () => dispatch(cloudServices.whitelist.find()),
    getWhitelistsForBroker: async () => {
      const user = store.getState().currentUser
      const accounts = await ethereum.getAccounts()
      const ethAddresses = accounts.map(address => ({ address }))

      const allLocalTokens = await localServices.localToken.find()
      const { data: localTokens } = await allLocalTokens.payload.promise
      const allWhitelists = await localServices.whitelist.find()
      const { data: whitelists } = await allWhitelists.payload.promise
      const brokerWhitelists = await ethereum.getWhitelistsForBroker(whitelists, Object.assign({}, user, { ethAddresses }), localTokens)
      const fetchedBrokerWhitelists = await cloudServices.whitelist.find({ query: { address: { $in: brokerWhitelists } } })
      const { data } = await fetchedBrokerWhitelists.payload.promise

      return data
    },
    setPage: page => dispatch({ type: 'SET_PAGE', model: 'whitelists', page }),
    setSort: sort => dispatch({ type: 'SET_SORT', model: 'whitelists', sort }),
    setSearch: search => dispatch({ type: 'SET_SEARCH', model: 'whitelists', search })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WhitelistsAvailableView)
