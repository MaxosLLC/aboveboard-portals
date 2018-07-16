import reduxifyServices from 'feathers-redux'
import feathersClient from './feathersClient'

const services = [ 'user', 'investor', 'localToken', 'transaction', 'multisig', 'pendingTransaction' ]

export default reduxifyServices(feathersClient, services)
