import reduxifyServices from 'feathers-redux'
import feathersClient from './feathersClient'
import { appType } from 'lib/util'

const services = [ 'user', 'token' ]

if (appType === 'broker') {
  services.push('whitelist')
}

export default reduxifyServices(feathersClient, services)
