import { connect } from 'react-redux'
import { each } from 'bluebird'
import localServices from 'lib/feathers/local/feathersServices'
import SettingsView from './SettingsView'
import ethereum from 'lib/ethereum'
import { appType } from 'lib/util'

const mapStateToProps = state => ({
  appType: state.config.appType,
  connected: state.wallet.connected,
  currentUser: state.currentUser,
  tokens: state.token.queryResult ? state.token.queryResult.data : [],
  watchingTokens: state.localToken.queryResult ? state.localToken.queryResult.data : [],
  loaded: state.currentUser.id && state.localToken.isFinished && state.token.isFinished,
  error: state.wallet.error
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    connectWallet (account, password) {
      return ethereum.init({ account, password })
    },
    startWatchingToken (token) {
      return dispatch(localServices.localToken.create(token))
        .then(() => dispatch(localServices.localToken.find()))
    },
    stopWatchingToken (token) {
      return dispatch(localServices.localToken.remove(null, { query: { address: token.address } }))
        .then(() => dispatch(localServices.localToken.find()))
    },
    setMessagingAddress (messagingAddress, tokens) {
      return dispatch(localServices.user.patch(null, { messagingAddress }, { query: { email: 'local@local.com' } }))
        .then(() => {
          if (appType === 'issuer') {
            return each(tokens, token => ethereum.setMessagingAddress(messagingAddress, token.address))
          }
        })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView)
