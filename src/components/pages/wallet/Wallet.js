import { connect } from 'react-redux'
import WalletView from './WalletView'

const mapStateToProps = state => ({
  connected: state.wallet.connected,
  currentUser: state.currentUser,
  wallet: state.wallet,
  error: state.wallet.error
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletView)
