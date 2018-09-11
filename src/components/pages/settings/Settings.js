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
  loaded: state.currentUser.id && state.localToken.isFinished,
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
    stopWatchingToken (currentToken) {
      return async token => {
        if (token.address === currentToken) {
          dispatch({ type: 'SET_CURRENT_TOKEN', tokenAddress: '' })
        }

        await dispatch(localServices.localToken.remove(null, { query: { address: token.address } }))
        return dispatch(localServices.localToken.find())
      }
    },
    setMessagingAddress (currentUser, messagingAddress, tokens) {
      return dispatch(localServices.user.patch(null, { messagingAddress }, { query: { emails: { $in: currentUser.emails } } }))
        .then(() => {
          if (currentUser.role === 'issuer' || currentUser.role === 'direct') {
            return each(tokens, token => ethereum.setMessagingAddress(messagingAddress, token.address))
          }
        })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView)
