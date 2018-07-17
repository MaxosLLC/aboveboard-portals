import client from 'lib/feathers/cloud/feathersClient'
import services from 'lib/feathers/cloud/feathersServices'
import store from 'redux/store'
import ethereum from 'lib/ethereum'

export default {
  init () {
    client.service('token').on('created', data => {
      store.dispatch(services.token.find())
    })
    client.service('token').on('patched', data => {
      store.dispatch(services.token.find())
    })

    client.service('whitelist').on('created', async data => {
      const user = store.getState().currentUser
      const localTokens = store.getState().localToken.queryResult.data
      const whitelists = await ethereum.getWhitelistsForBroker(user, localTokens)

      store.dispatch(services.whitelist.find({ query: { address: { $in: whitelists } } }))
    })
    client.service('whitelist').on('patched', async data => {
      const user = store.getState().currentUser
      const localTokens = store.getState().localToken.queryResult.data
      const whitelists = await ethereum.getWhitelistsForBroker(user, localTokens)

      store.dispatch(services.whitelist.find({ query: { address: { $in: whitelists } } }))
    })
  }
}
