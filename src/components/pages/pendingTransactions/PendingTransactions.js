import { connect } from 'react-redux'

import localServices from 'lib/feathers/local/feathersServices'
import PendingTransactionsView from './PendingTransactionsView'

const mapStateToProps = state => ({
  pendingTransactions: state.pendingTransaction.queryResult ? state.pendingTransaction.queryResult.data : [],
  page: state.page.pendingTransactions,
  search: state.search.pendingTransactions,
  queryResult: {
    pendingTransactions: state.pendingTransaction.queryResult || { total: 0, limit: 0 }
  },
  multisigWallet: state.multisig.queryResult ? state.multisig.queryResult.data[0] || {} : {},
  loaded: state.pendingTransaction.isFinished && state.multisig.isFinished
})

const mapDispatchToProps = dispatch => {
  return {
    loadMultisigWallet: () => dispatch(localServices.multisig.find({ query: { $limit: 1 } })),
    loadPendingTransactions: () => dispatch(localServices.pendingTransaction.find()),
    setPage: page => dispatch({ type: 'SET_PAGE', model: 'pendingTransactions', page }),
    setSort: sort => dispatch({ type: 'SET_SORT', model: 'pendingTransactions', sort }),
    setSearch: search => dispatch({ type: 'SET_SEARCH', model: 'pendingTransactions', search })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PendingTransactionsView)
