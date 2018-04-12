import reduxifyServices from 'feathers-redux'
import feathersClient from './feathersClient'

const appType = /issuer/.test(window.location.hostname) ? 'issuer' : 'broker'

const servicesByType = {
  broker: ['user', 'localToken', 'investor'],
  issuer: ['user', 'localToken', 'shareholder', 'transaction']
}

export default reduxifyServices(feathersClient, servicesByType[appType])
