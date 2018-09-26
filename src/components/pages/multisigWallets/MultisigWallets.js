import { connect } from 'react-redux'

import MultisigWalletsView from './MultisigWalletsView'
import ethereum from 'lib/ethereum'
import localServices from 'lib/feathers/local/feathersServices'

const ethereumAddressRegExp = /^(0x)?[0-9a-f]{40}$/i

const mapStateToProps = state => ({
  multisigWallet: state.multisig.queryResult ? state.multisig.queryResult.data[0] || {} : {},
  connected: state.wallet.connected,
  loaded: state.multisig.isFinished
})

const mapDispatchToProps = dispatch => {
  const loadMultisigWallet = () => dispatch(localServices.multisig.find({ query: { $limit: 1 } }))

  return {
    loadMultisigWallet,
    async addMultisigWallet (address) {
      if (!ethereumAddressRegExp.test(address)) {
        return alert('Wallet address must be a valid ethereum address') // eslint-disable-line
      }

      await dispatch(localServices.multisig.create({ address }))

      return loadMultisigWallet()
    },
    async changeMultisigWallet (address) {
      if (!ethereumAddressRegExp.test(address)) {
        return alert('New Wallet address must be a valid ethereum address') // eslint-disable-line
      }

      await dispatch(localServices.multisig.patch(null, { address })) // TODO: add query if we allow more than one multisig wallet at a time

      return loadMultisigWallet()
    },
    addSigner (signerAddress = '0x001a2Cc52383beBd5Eeadea47c6b8e3194C2851A', multisigWalletAddress) {
      ethereum.addSigner(signerAddress, multisigWalletAddress)
    },
    removeSigner (signerAddress = '0x001a2Cc52383beBd5Eeadea47c6b8e3194C2851A', multisigWalletAddress) {
      ethereum.removeSigner(signerAddress, multisigWalletAddress)
    },
    getCurrentRequirement: ethereum.getCurrentRequirement,
    getOwners: ethereum.getOwners,
    changeRequirement: ethereum.changeRequirement
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultisigWalletsView)
