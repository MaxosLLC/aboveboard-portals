import reduxifyServices from 'feathers-redux'
import feathersClient from './feathersClient'
import { appType } from 'lib/util'

const services = [ 'user', 'token' ]

if (appType === 'broker' || appType === 'direct') {
  services.push('whitelist')
}

export default reduxifyServices(feathersClient, services)
