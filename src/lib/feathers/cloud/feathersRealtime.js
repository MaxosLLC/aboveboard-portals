import client from 'lib/feathers/cloud/feathersClient'
import services from 'lib/feathers/cloud/feathersServices'
import store from 'redux/store'
import { appType } from 'lib/util'

export default {
  init () {
    client.service('token').on('created', data => {
      store.dispatch(services.token.find())
    })
    client.service('token').on('patched', data => {
      store.dispatch(services.token.find())
    })

    if (appType === 'broker' || appType === 'direct') {
      client.service('whitelist').on('created', data => {
        store.dispatch(services.whitelist.find())
      })
      client.service('whitelist').on('patched', data => {
        store.dispatch(services.whitelist.find())
      })
    }
  }
}
