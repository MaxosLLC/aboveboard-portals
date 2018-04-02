import client from 'lib/feathers/cloud/feathersClient'
import services from 'lib/feathers/cloud/feathersServices'
import store from 'redux/store'

const appType = /issuer/.test(window.location.hostname) ? 'issuer' : 'broker'

export default {
  init() {
    client.service('token').on('created', data => {
      // TODO: optimize
      store.dispatch(services.token.find({}))
    })
    client.service('token').on('patched', data => {
      // TODO: optimize
      store.dispatch(services.token.find({}))
    })

    if (appType === 'broker') {
      client.service('whitelist').on('created', data => {
        // TODO: optimize
        store.dispatch(services.whitelist.find({}))
      })
      client.service('whitelist').on('patched', data => {
        // TODO: optimize
        store.dispatch(services.whitelist.find({}))
      })
    }
  },
}
