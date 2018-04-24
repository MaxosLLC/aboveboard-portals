import reduxifyServices from 'feathers-redux'
import feathersClient from './feathersClient'
import { appType } from 'lib/util'

const servicesByType = {
  broker: [ 'user', 'localToken', 'investor' ],
  direct: [ 'user', 'investor', 'localToken', 'shareholder', 'transaction' ],
  issuer: [ 'user', 'localToken', 'shareholder', 'transaction' ]
}

export default reduxifyServices(feathersClient, servicesByType[appType])
