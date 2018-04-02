import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

const appType = process.env.REACT_APP_APP_TYPE || /issuer/.test(window.location.hostname) ? 'issuer' : 'broker'

console.log('app type ', process.env.REACT_APP_APP_TYPE)

const url = process.env.REACT_APP_APP_TYPE ? `${window.location.hostname}:3031` :
  appType === 'broker' ? process.env.REACT_APP_BROKER_LOCAL_API_URL || 'https://aboveboard-broker-api.herokuapp.com/'
  : process.env.REACT_APP_ISSUER_LOCAL_API_URL || 'https://aboveboard-issuer-api.herokuapp.com/'

const socket = io(url, {
  transports: ['websocket']
})

const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 10000, 'force new connection': true }))
  .configure(auth())

export default feathersClient
