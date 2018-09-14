import { connect } from 'react-redux'
import { each } from 'bluebird'
import localServices from 'lib/feathers/local/feathersServices'
import SettingsView from './SettingsView'
import ethereum from 'lib/ethereum'

const mapStateToProps = state => ({
  role: state.currentUser.role,
  connected: state.wallet.connected,
  currentUser: state.currentUser,
  currentToken: state.tokens.current,
  tokens: state.localToken.queryResult ? state.localToken.queryResult.data : [],
  whitelists: state.whitelist.queryResult ? state.whitelist.queryResult.data : [],
  loaded: state.currentUser.id && state.localToken.isFinished && state.whitelist.isFinished,
  error: state.wallet.error
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    connectWallet (account, password) {
      return ethereum.init({ account, password })
    },
    async setMessagingAddress (currentUser, messagingAddress, tokens, whitelists) {
      await dispatch(localServices.user.patch(null, { messagingAddress }, { query: { emails: { $in: currentUser.emails } } }))
      if (currentUser.role === 'issuer' || currentUser.role === 'direct') {
        await each(tokens, token => ethereum.setMessagingAddress('token', messagingAddress, token.address))
        return each(whitelists, whitelist => ethereum.setMessagingAddress('whitelist', messagingAddress, whitelist.address))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView)
