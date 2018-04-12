import feathersCloudAuthentication from 'lib/feathers/cloud/feathersAuthentication'
import feathersLocalAuthentication from 'lib/feathers/local/feathersAuthentication'

const publicAuthData = {
  strategy: 'local',
  email: 'public@aboveboard.com',
  password: 'Public12'
}

const localAuthData = {
  strategy: 'local',
  email: 'local@local.com',
  password: 'local'
}

const init = store =>
  store.dispatch(feathersCloudAuthentication.authenticate(publicAuthData))
    .then(() => store.dispatch(feathersLocalAuthentication.authenticate(localAuthData)))
    .then(results => {
      store.dispatch({
        type: 'LOGIN_SUCCESS',
        user: results.value.user,
        accessToken: results.value.accessToken
      })
    })
    .catch(e => console.error(`Login error: ${e}`))

export default init
