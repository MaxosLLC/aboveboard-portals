import { connect } from 'react-redux'
import { each } from 'bluebird'
import { push } from 'react-router-redux'
import store from 'redux/store'

import cloudServices from 'lib/feathers/cloud/feathersServices'
import CreateWhitelistView from './CreateWhitelistView'
import ethereum from 'lib/ethereum'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createWhitelist: async ({ name, type, tokens = [] }) => {
      const address = await ethereum.deployNewWhitelist(type)

      await each(tokens, token => ethereum.addWhitelistToToken(address, token))

      const user = store.getState().currentUser
      await cloudServices.whitelist.create({ user, name, type, tokens: tokens.map(address => ({ address })), address })

      return dispatch(push('/available-whitelists'))
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWhitelistView)
