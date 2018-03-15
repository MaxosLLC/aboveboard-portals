import reduxifyServices from 'feathers-redux'
import feathersClient from './feathersClient'

export default reduxifyServices(feathersClient, [ 'message' ])
