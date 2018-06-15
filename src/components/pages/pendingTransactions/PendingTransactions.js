import { connect } from 'react-redux'
import PendingTransactionsView from './PendingTransactionsView'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => {
  return {
    loadPendingTransactions: () => {},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PendingTransactionsView)
