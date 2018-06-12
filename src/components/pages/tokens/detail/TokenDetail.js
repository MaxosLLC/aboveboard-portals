import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import ethereum from 'lib/ethereum'
import localServices from 'lib/feathers/local/feathersServices'
import localClient from 'lib/feathers/local/feathersClient'
import TokenDetailView from './TokenDetailView'

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.currentUser,
  token: state.token.queryResult && state.token.queryResult.data ? state.token.queryResult.data.filter(token => token.address === ownProps.match.params.address)[0] || {} : {},
  localToken: state.localToken.queryResult && state.localToken.queryResult.data ? state.localToken.queryResult.data[0] : {},
  shareholders: state.shareholder.queryResult ? state.shareholder.queryResult.data : [],
  transactions: state.transaction.queryResult ? state.transaction.queryResult.data : [],
  totalTransactions: state.totals.transactions[ownProps.match.params.address] || 0,
  queryResult: {
    shareholders: state.shareholder.queryResult || { total: 0, limit: 0 },
    transactions: state.transaction.queryResult || { total: 0, limit: 0 }
  },
  page: state.page,
  search: state.search,
  loaded: state.shareholder.isFinished && state.transaction.isFinished && state.token.isFinished && state.localToken.isFinished
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    routeTo: path => dispatch(push(path)),
    loadShareholders: currentUser => {
      const query = { 'ethAddresses.issues.address': ownProps.match.params.address }

      return dispatch(localServices[currentUser.role === 'issuer' ? 'shareholder' : 'investor'].find({ query }))
        .then(({ value }) => {
          console.log('value ', value)
          return value
        })
    },
    loadTransactions: () => {
      const query = { contractAddress: ownProps.match.params.address }

      return dispatch(localServices.transaction.find({ query })).then(({ value }) => {
        dispatch({ type: 'SET_TOTAL_TRANSACTIONS', contractAddress: ownProps.match.params.address, tokens: value.total })
        return value
      })
    },
    loadLocalToken: () => dispatch(localServices.localToken.find({ query: { address: ownProps.match.params.address } })),
    loadAll: type => {
      const allData = []

      const fetchPage = (page = 0) =>
        localClient.service(type).find({ query: { $skip: page * 25, [type === 'shareholder' ? 'ethAddresses.issues.address' : 'contractAddress']: ownProps.match.params.address } })
          .then(({ data }) => {
            data.forEach(item => { allData.push(item) })

            if (data[0]) {
              return fetchPage(page + 1)
            }
          })
          .then(() => allData)

      return fetchPage()
    },
    setPage: (model, page) => dispatch({ type: 'SET_PAGE', model, page }),
    setSort: (model, sort) => dispatch({ type: 'SET_SORT', model, sort }),
    setSearch: (model, search) => dispatch({ type: 'SET_SEARCH', model, search }),
    getTokenTrading: () => {},
    // getTokenTrading: tokenAddress => ethereum.getTradingLock(tokenAddress),
    setTokenTrading: (tokenAddress, trading) =>
      ethereum.setTradingLock(tokenAddress, !trading)
        .then(() => dispatch(localServices.localToken.patch(null, { trading }, { query: { address: tokenAddress } })))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenDetailView)
