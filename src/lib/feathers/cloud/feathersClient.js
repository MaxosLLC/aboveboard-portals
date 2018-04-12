import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

const url = window.REACT_APP_APP_TYPE ? 'https://aboveboard-cloud-api-prod.herokuapp.com/' : (process.env.REACT_APP_CLOUD_API_URL || 'https://aboveboard-cloud-api.herokuapp.com/')

const socket = io(url, {
  transports: ['websocket']
})

const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 10000, 'force new connection': true }))
  .configure(auth({ storage: window.localStorage }))

export default feathersClient
