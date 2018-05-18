import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

const url = window.REACT_APP_APP_TYPE ? 'https://aboveboard-gmc-api-prod.herokuapp.com/' : (process.env.REACT_APP_GMC_API_URL || 'https://aboveboard-gmc-api.herokuapp.com/')

const socket = io(url, {
  transports: ['websocket']
})

const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 10000, 'force new connection': true }))
  .configure(auth({ storage: window.localStorage, storageKey: 'gmc-feathers-jwt' }))

export default feathersClient
