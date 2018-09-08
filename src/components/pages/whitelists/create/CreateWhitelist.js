import { connect } from 'react-redux'
import { each } from 'bluebird'
import { push } from 'react-router-redux'

import localServices from 'lib/feathers/cloud/feathersServices'
import CreateWhitelistView from './CreateWhitelistView'
import ethereum from 'lib/ethereum'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createWhitelist: async ({ name, type, tokens = [] }) => {
      try {
        const address = await ethereum.deployNewWhitelist(type)

        await each(tokens, token => ethereum.addWhitelistToToken(address, token))

        await localServices.whitelist.create({ name, type, tokens: tokens.map(address => ({ address })), address })

        return dispatch(push('/available-whitelists'))
      } catch (e) {
        console.error(`Error creating whitelist ${e.message || e}`)
      }
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWhitelistView)
