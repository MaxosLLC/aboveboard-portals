import { connect } from 'react-redux'
import { each } from 'bluebird'

import cloudServices from 'lib/feathers/cloud/feathersServices'
import CreateWhitelistView from './CreateWhitelistView'
import ethereum from 'lib/ethereum'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createWhitelist: async ({ name, type, tokens }) => {
      const address = await ethereum.deployContract('whitelist', type)

      await each(tokens, token => ethereum.addWhitelistToToken(address, token))

      return cloudServices.whitelist.create({ name, type, tokens: tokens.map(address => ({ address })), address })
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWhitelistView)
