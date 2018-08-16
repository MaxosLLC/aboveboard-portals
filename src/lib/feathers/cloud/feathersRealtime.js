import client from 'lib/feathers/cloud/feathersClient'
import cloudServices from 'lib/feathers/cloud/feathersServices'
import localServices from 'lib/feathers/local/feathersServices'
import store from 'redux/store'
import ethereum from 'lib/ethereum'

const updateWhitelists = async () => {
  const user = store.getState().currentUser
  const allLocalTokens = await localServices.localToken.find()
  const { data: allLocalTokensData } = await allLocalTokens.payload.promise
  const allWhitelists = await cloudServices.whitelist.find()
  const { data: allWhitelistsData } = await allWhitelists.payload.promise
  const whitelists = await ethereum.getWhitelistsForBroker(allWhitelistsData, user, allLocalTokensData)

  return store.dispatch(cloudServices.whitelist.find({ query: { address: { $in: whitelists } } }))
}

export default {
  init () {
    client.service('token').on('created', data => {
      store.dispatch(cloudServices.token.find())
    })
    client.service('token').on('patched', data => {
      store.dispatch(cloudServices.token.find())
    })

    client.service('whitelist').on('created', updateWhitelists)
    client.service('whitelist').on('patched', updateWhitelists)
  }
}
