import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import localServices from 'lib/feathers/local/feathersServices'
import localClient from 'lib/feathers/local/feathersClient'
import TokenDetailView from './TokenDetailView'

const mapStateToProps = (state, ownProps) => ({
  token: state.token.queryResult && state.token.queryResult.data ? state.token.queryResult.data.filter(token => token.address === ownProps.match.params.address)[0] || {} : {},
  localToken: state.localToken.queryResult && state.localToken.queryResult.data ? state.localToken.queryResult.data[0] : {},
  shareholders: state.shareholder.queryResult ? state.shareholder.queryResult.data : [],
  transactions: state.transaction.queryResult ? state.transaction.queryResult.data : [],
  loaded: state.shareholder.isFinished && state.transaction.isFinished && state.token.isFinished && state.localToken.isFinished
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    routeTo (path) { dispatch(push(path)) },
    loadShareholders: ($sort = { createdAt: -1 }, page = 0, search = '') => {
      const query = { 'ethAddresses.issues.address': ownProps.match.params.address, $sort, $skip: page * 25 }
      if (search) { query.search = search }
      dispatch(localServices.shareholder.find({ query }))
    },
    loadTransactions: ($sort = { createdAt: -1 }, page = 0, search) => {
      const query = { contractAddress: ownProps.match.params.address, $sort, $skip: page * 25 }
      if (search) { query.search = search }
      dispatch(localServices.transaction.find({ query }))
    },
    loadLocalToken: () => dispatch(localServices.localToken.find({ query: { address: ownProps.match.params.address } })),
    loadAll: type => {
      const allData = []

      const fetchPage = page =>
        localClient.service(type).find({ query: { $skip: page * 25, [type === 'shareholder' ? 'ethAddresses.issues.address' : 'contractAddress']: ownProps.match.params.address } })
          .then(({ data }) => {
            data.forEach(item => { allData.push(item) })

            if (data[0]) {
              return fetchPage(page + 1)
            }
          })
          .then(() => allData)

      return fetchPage(0)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenDetailView)
