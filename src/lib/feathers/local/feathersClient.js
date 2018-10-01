import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

const appType = /issuer/.test(window.location.hostname) ? 'issuer' : /direct/.test(window.location.hostname) ? 'direct' : 'broker'

export const url = window.REACT_APP_APP_TYPE ? `${window.location.protocol}//${window.location.host}/local-api/`
  : process.env.REACT_APP_NODE_ENV === 'test' ? process.env[`REACT_APP_${appType.toUpperCase()}_LOCAL_API_TEST_URL`]
  : appType === 'broker' ? process.env.REACT_APP_BROKER_LOCAL_API_URL || 'https://aboveboard-broker-api.herokuapp.com/'
  : appType === 'direct' || appType === 'issuer' ? process.env.REACT_APP_DIRECT_LOCAL_API_URL || 'https://aboveboard-issuer-api.herokuapp.com/'
  : process.env.REACT_APP_ISSUER_LOCAL_API_URL || 'https://aboveboard-issuer-api.herokuapp.com/'

const socket = io(url.replace(/local-api\//, ''), {
  transports: ['websocket']
})

const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 10000, 'force new connection': true }))
  .configure(auth({ storage: window.localStorage, storageKey: 'local-feathers-jwt' }))

export default feathersClient
