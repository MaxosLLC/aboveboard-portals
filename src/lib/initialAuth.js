import feathersCloudAuthentication from 'lib/feathers/cloud/feathersAuthentication'
import feathersLocalAuthentication from 'lib/feathers/local/feathersAuthentication'

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

const queryStringAccessToken = getParameterByName('accessToken')

const accessToken = queryStringAccessToken || window.localStorage && // eslint-disable-line
                      window.localStorage.getItem && // eslint-disable-line
                      window.localStorage.getItem('feathers-jwt') // eslint-disable-line

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

const init = store => {
  if (accessToken) {
    const authenticationOptions = {
      strategy: 'jwt',
      accessToken
    }

    return store.dispatch(feathersCloudAuthentication.authenticate(publicAuthData))
      .then(() => store.dispatch(feathersLocalAuthentication.authenticate(authenticationOptions)))
      .then(results => {
        store.dispatch({
          type: 'LOGIN_SUCCESS',
          user: results.value.user,
          accessToken: results.value.accessToken
        })
      })
      .catch(() =>
        store.dispatch(feathersLocalAuthentication.authenticate(localAuthData))
          .then(results => {
            store.dispatch({
              type: 'LOGIN_SUCCESS',
              user: results.value.user,
              accessToken: results.value.accessToken
            })
          }))
  } else {
    return Promise.resolve()
  }
}

export default init
