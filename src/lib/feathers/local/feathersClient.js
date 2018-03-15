import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

const appType = /issuer/.test(window.location.hostname) ? 'issuer' : 'broker'

const url = appType === 'broker' ? process.env.REACT_APP_BROKER_LOCAL_API_URL || 'https://aboveboard-broker-api.herokuapp.com/'
  : process.env.REACT_APP_ISSUER_LOCAL_API_URL || 'https://aboveboard-issuer-api.herokuapp.com/'

const socket = io(url, {
  transports: ['websocket']
})

const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 10000, 'force new connection': true }))
  .configure(auth())

export default feathersClient
