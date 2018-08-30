import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import store from 'redux/store'

import cloudServices from 'lib/feathers/cloud/feathersServices'
import CreateTokenView from './CreateTokenView'
import ethereum from 'lib/ethereum'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createToken: async ({ name, symbol, decimals, affiliates }) => {
      try {
        const address = await ethereum.deployNewToken(name, symbol, decimals)
        const user = store.getState().currentUser

        if (affiliates) {
          const tokens = [{ address }]
          const whitelistAddress = await ethereum.deployNewWhitelist('affiliates', tokens)
          await ethereum.addWhitelistToToken(whitelistAddress, address)
          await cloudServices.whitelist.create({ user, name: `${name} Affiliates`, type: 'affiliates', address: whitelistAddress, tokens })
        }

        await cloudServices.token.create({ user, name, symbol, address, decimals })

        return dispatch(push('/tokens'))
      } catch (e) {
        console.error(`Error creating token ${e.message || e}`)
      }
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTokenView)
