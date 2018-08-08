import { connect } from 'react-redux'

import WalletBlockerView from './WalletBlockerView'

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  processing: state.wallet.processing,
  method: state.wallet.method
})

export default connect(mapStateToProps)(WalletBlockerView)
