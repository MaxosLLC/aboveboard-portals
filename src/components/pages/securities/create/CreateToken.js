import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { each } from 'bluebird'

import localServices from 'lib/feathers/local/feathersServices'
import CreateTokenView from './CreateTokenView'
import ethereum from 'lib/ethereum'
import store from 'redux/store'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createToken: async ({ name, symbol, decimals = 0, affiliates = true, initialNumber, firstName, lastName }) => {
      try {
        const user = store.getState().currentUser
        const address = await ethereum.deployNewToken(name, symbol, decimals)

        await dispatch(localServices.localToken.create({ name, symbol, address, decimals }))

        if (affiliates) {
          const tokens = [{ address }]
          const whitelistAddress = await ethereum.deployNewWhitelist('affiliates', tokens)

          await ethereum.addWhitelistToToken(whitelistAddress, address)

          await dispatch(localServices.whitelist.create({ name: `${name} Affiliates`, type: 'affiliates', address: whitelistAddress, tokens }))

          await dispatch(localServices.whitelist.find())
          await dispatch(localServices.localToken.find())

          try {
            await dispatch(localServices.investor.create({ firstName, lastName, email: user.emails[0], ethAddresses: user.ethAddresses }))
          } catch (e) {
            if (e.message !== 'A user with this ethereum address already exists') {
              throw e
            }
          }

          await each(user.ethAddresses, ({ address }) => ethereum.addInvestorToWhitelist(address, whitelistAddress))

          await ethereum.mint(address, +initialNumber.replace(/[,]/g, ''))
        }

        return dispatch(push('/securities'))
      } catch (e) {
        console.error(`Error creating token ${e.message || e}`)
      }
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTokenView)
