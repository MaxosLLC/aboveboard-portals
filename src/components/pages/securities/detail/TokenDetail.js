import { map } from 'bluebird'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import ethereum from 'lib/ethereum'
import localServices from 'lib/feathers/local/feathersServices'
import localClient from 'lib/feathers/local/feathersClient'
import TokenDetailView from './TokenDetailView'

const mapStateToProps = (state, ownProps) => ({
  currentToken: ownProps.match.params.address,
  localToken: state.localToken.queryResult && state.localToken.queryResult.data ? state.localToken.queryResult.data[0] : {},
  shareholders: state.investor.queryResult ? state.investor.queryResult.data : [],
  transactions: state.transaction.queryResult ? state.transaction.queryResult.data : [],
  totalTransactions: state.totals.transactions[ownProps.match.params.address] || 0,
  totalShareholders: state.totals.shareholders[ownProps.match.params.address] || 0,
  queryResult: {
    shareholders: state.investor.queryResult || { total: 0, limit: 0 },
    transactions: state.transaction.queryResult || { total: 0, limit: 0 }
  },
  page: state.page,
  search: state.search,
  loaded: state.investor.isFinished && state.transaction.isFinished && state.token.isFinished && state.localToken.isFinished
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    routeTo: path => dispatch(push(path)),
    setCurrentToken: tokenAddress => dispatch({ type: 'SET_CURRENT_TOKEN', tokenAddress }),
    loadShareholders: async currentUser => {
      const contractAddress = ownProps.match.params.address
      const query = { 'ethAddresses.issues.address': contractAddress }

      const { value } = await dispatch(localServices.investor.find({ query }))

      dispatch({ type: 'SET_TOTAL_SHAREHOLDERS', contractAddress, shareholders: value.total })

      value.data = await map(value.data, async investor => {
        investor.ethAddresses = await map(investor.ethAddresses, async ethAddress => {
          if (Array.isArray(ethAddress.issues)) {
            ethAddress.issues = await map(ethAddress.issues, async issue => {
              if (issue.address === contractAddress) {
                const tokens = await ethereum.getBalanceForAddress(contractAddress, ethAddress.address)

                issue.tokens = tokens
              }

              return issue
            })
          }

          return ethAddress
        })

        return investor
      })

      return value
    },
    loadTransactions: () => {
      const contractAddress = ownProps.match.params.address
      const query = { contractAddress }

      return dispatch(localServices.transaction.find({ query })).then(({ value }) => {
        dispatch({ type: 'SET_TOTAL_TRANSACTIONS', contractAddress, tokens: value.total })
        return value
      })
    },
    loadLocalToken: () => dispatch(localServices.localToken.find({ query: { address: ownProps.match.params.address } })),
    loadAll: type => {
      const allData = []

      const fetchPage = (page = 0) =>
        localClient.service(type).find({ query: { $skip: page * 25, [type === 'investor' ? 'ethAddresses.issues.address' : 'contractAddress']: ownProps.match.params.address } })
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
    getTokenTrading: tokenAddress => ethereum.getTradingLock(tokenAddress),
    setTokenTrading: (tokenAddress, active) => ethereum.setTradingLock(tokenAddress, !active),
    mintShares: amount => ethereum.mint(ownProps.match.params.address, amount),
    distributeShares: (amount, to) => ethereum.transfer(ownProps.match.params.address, to, amount)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenDetailView)
