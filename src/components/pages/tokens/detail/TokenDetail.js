import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import localServices from 'lib/feathers/local/feathersServices'
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
    loadShareholders: () => dispatch(localServices.shareholder.find({ query: { 'ethAddresses.issues.address': ownProps.match.params.address } })),
    loadTransactions: () => dispatch(localServices.transaction.find({ query: { contractAddress: ownProps.match.params.address } })),
    loadLocalToken: () => dispatch(localServices.localToken.find({ query: { address: ownProps.match.params.address } }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenDetailView)
