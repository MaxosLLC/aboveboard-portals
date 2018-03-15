import { connect } from 'react-redux'
import localServices from 'lib/feathers/local/feathersServices'
import SettingsView from './SettingsView'
import ethereum from 'lib/ethereum'

const mapStateToProps = state => ({
  connected: state.wallet.connected,
  currentUser: state.currentUser,
  tokens: state.token.queryResult ? state.token.queryResult.data : [],
  watchingTokens: state.localToken.queryResult ? state.localToken.queryResult.data : [],
  loaded: state.currentUser.id && state.localToken.isFinished && state.token.isFinished
})

const mapDispatchToProps = dispatch => {
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView)
