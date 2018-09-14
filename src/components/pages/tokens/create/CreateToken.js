import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import localServices from 'lib/feathers/local/feathersServices'
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

        if (affiliates) {
          const tokens = [{ address }]
          const whitelistAddress = await ethereum.deployNewWhitelist('affiliates', tokens)

          await ethereum.addWhitelistToToken(whitelistAddress, address)

          await localServices.whitelist.create({ name: `${name} Affiliates`, type: 'affiliates', address: whitelistAddress, tokens })
        }

        await localServices.localToken.create({ name, symbol, address, decimals })

        return dispatch(push('/tokens'))
      } catch (e) {
        console.error(`Error creating token ${e.message || e}`)
      }
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTokenView)
