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
      ethereum.setTokenApproval('')
    },
    approveTx () {
      ethereum.approveTx('')
    },
    sendTokens () {
      ethereum.sendTokens('')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultisigWalletsView)
