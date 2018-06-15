import { connect } from 'react-redux'
import MultisigWalletDetailView from './MultisigWalletDetailView'

const mapStateToProps = state => ({})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadMultisigWallet: () => {
      const { address } = ownProps.match.params
      console.log(`Loading addresses for multisig wallet at ${address}`)
      // call initial methods here
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultisigWalletDetailView)
