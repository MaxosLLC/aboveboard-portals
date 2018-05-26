import feathersLocalAuthentication from 'lib/feathers/local/feathersAuthentication'
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

const accessToken = queryStringAccessToken || (window.localStorage && window.localStorage.getItem && window.localStorage.getItem('local-feathers-jwt'))

const init = store => {
  if (accessToken) {
    const authenticationOptions = {
      strategy: 'jwt',
      accessToken
    }

    return store.dispatch(feathersLocalAuthentication.authenticate(authenticationOptions))
      .then(results => {
        store.dispatch({
          type: 'LOGIN_SUCCESS',
          user: results.value.user,
          accessToken: results.value.accessToken
        })

        if (window.location.pathname === '/token-login') {
          store.dispatch(push('/'))
        }
      })
      .catch(() => store.dispatch(push('/login')))
  } else {
    return Promise.resolve()
  }
}

export default init
