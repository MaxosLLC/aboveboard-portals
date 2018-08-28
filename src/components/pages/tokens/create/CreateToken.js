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
      const address = await ethereum.deployNewToken(name, symbol, decimals)

      if (affiliates) {
        const whitelistAddress = await ethereum.deployNewWhitelist('affiliates')
        await ethereum.addWhitelistToToken(whitelistAddress, address)
        await cloudServices.whitelist.create({ name: `${name} Affiliates`, type: 'affiliates', address: whitelistAddress, tokens: [{ address }] })
      }

      const user = store.getState().currentUser
      await cloudServices.token.create({ user, name, symbol, address, decimals })

      return dispatch(push('/tokens'))
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTokenView)
