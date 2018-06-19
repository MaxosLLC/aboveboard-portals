import { connect } from 'react-redux'
import MultisigWalletsView from './MultisigWalletsView'
import ethereum from 'lib/ethereum'

const mapStateToProps = state => ({
  some: 'initialState',
  addresses: [] // TODO: get these from somewhere
})

const mapDispatchToProps = dispatch => {
  return {
    setTokenApproval () {
      ethereum.setTokenApproval('0xCc6510781F707691A1DA7997D0DD35d8b68b78B6')
    },
    approveTx () {
      ethereum.approveTx(6)
    },
    sendTokens () {
      ethereum.sendTokens('0xCc6510781F707691A1DA7997D0DD35d8b68b78B6')
    },
    addSigner () {
      ethereum.addSigner('0x001a2Cc52383beBd5Eeadea47c6b8e3194C2851A')
    },
    removeSigner () {
      ethereum.removeSigner('0x001a2Cc52383beBd5Eeadea47c6b8e3194C2851A')
    },
    changeRequirement () {
      ethereum.changeRequirement(2)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultisigWalletsView)
