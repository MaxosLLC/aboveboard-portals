import feathersCloudAuthentication from 'lib/feathers/cloud/feathersAuthentication'
import { push } from 'react-router-redux'

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

const init = store => {
  if (accessToken) {
    const authenticationOptions = {
      strategy: 'jwt',
      accessToken
    }

    return store.dispatch(feathersCloudAuthentication.authenticate(authenticationOptions))
      .then(results => {
        store.dispatch({
          type: 'LOGIN_SUCCESS',
          user: results.value.user,
          accessToken: results.value.accessToken
        })
      })
      .catch(() => store.dispatch(push('/login')))
  } else {
    return Promise.resolve()
  }
}

export default init
