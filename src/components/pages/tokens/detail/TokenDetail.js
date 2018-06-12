import Promise, { map } from 'bluebird'
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
  shareholders: state[state.currentUser.role === 'issuer' ? 'shareholder' : 'investor'].queryResult ? state[state.currentUser.role === 'issuer' ? 'shareholder' : 'investor'].queryResult.data : [],
  transactions: state.transaction.queryResult ? state.transaction.queryResult.data : [],
  totalTransactions: state.totals.transactions[ownProps.match.params.address] || 0,
  queryResult: {
    shareholders: state[state.currentUser.role === 'issuer' ? 'shareholder' : 'investor'].queryResult || { total: 0, limit: 0 },
    transactions: state.transaction.queryResult || { total: 0, limit: 0 }
  },
  page: state.page,
  search: state.search,
  loaded: state[state.currentUser.role === 'issuer' ? 'shareholder' : 'investor'].isFinished && state.transaction.isFinished && state.token.isFinished && state.localToken.isFinished
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    routeTo: path => dispatch(push(path)),
    loadShareholders: async currentUser => {
      const tokenAddress = ownProps.match.params.address
      const query = { 'ethAddresses.issues.address': tokenAddress }

      const { value } = await dispatch(localServices[currentUser.role === 'issuer' ? 'shareholder' : 'investor'].find({ query }))
console.log('lsh1 ')
      value.data = await map(value.data, async investor => {
        console.log('lsh2 ')
        investor.ethAddresses = investor.ethAddresses.map(async ethAddress => {
          console.log('lsh3 ', ethAddress)
          if (Array.isArray(ethAddress.issues)) {
            console.log('lsh4 ', ethAddress.issues)
            ethAddress.issues = ethAddress.issues.map(async issue => {
              console.log('lsh5 ', issue)
              if (issue.address === tokenAddress) {
                const tokens = await ethereum.getBalanceForAddress(tokenAddress, ethAddress.address)
console.log('lsh6 ', tokens)
                issue.tokens = tokens
                
              }

              return issue
            })
          }
        })

        return investor
      })

      return value
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
    getTokenTrading: () => Promise.resolve(),
    // getTokenTrading: tokenAddress => ethereum.getTradingLock(tokenAddress),
    setTokenTrading: (tokenAddress, trading) =>
      ethereum.setTradingLock(tokenAddress, !trading)
        .then(() => dispatch(localServices.localToken.patch(null, { trading }, { query: { address: tokenAddress } })))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenDetailView)
