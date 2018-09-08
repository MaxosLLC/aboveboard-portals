import reduxifyServices from 'feathers-redux'
import feathersClient from './feathersClient'

const services = [ 'user', 'investor', 'localToken', 'transaction', 'multisig', 'pendingTransaction', 'whitelist' ]

export default reduxifyServices(feathersClient, services)
