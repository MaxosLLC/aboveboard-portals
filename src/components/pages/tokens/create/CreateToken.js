import { connect } from 'react-redux'

import cloudServices from 'lib/feathers/cloud/feathersServices'
import CreateTokenView from './CreateTokenView'
import ethereum from 'lib/ethereum'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createToken: async ({ name, symbol, affiliates }) => {
      const address = await ethereum.deployNewToken(name, symbol)

      if (affiliates) {
        const whitelistAddress = await ethereum.deployContract('whitelist', 'affiliates')
        await ethereum.addWhitelistToToken(whitelistAddress, address)
        await cloudServices.whitelist.create({ name: `${name} Affiliates`, type: 'affiliates', address: whitelistAddress, tokens: [{ address }] })
      }

      return cloudServices.token.create({ name, symbol, address })
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTokenView)
