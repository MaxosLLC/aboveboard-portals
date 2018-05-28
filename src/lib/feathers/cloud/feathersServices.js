import reduxifyServices from 'feathers-redux'
import feathersClient from './feathersClient'

const services = [ 'user', 'token', 'whitelist' ]

export default reduxifyServices(feathersClient, services)
