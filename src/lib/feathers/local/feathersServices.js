import reduxifyServices from 'feathers-redux'
import feathersClient from './feathersClient'

const services = [ 'user', 'investor', 'localToken', 'shareholder', 'transaction', 'multisig', 'pendingTransaction' ]

export default reduxifyServices(feathersClient, services)
