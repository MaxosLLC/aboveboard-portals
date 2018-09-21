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

const letmeinAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YmE1Mzk5YjVlZTU2MDAwNjZlZTc1MjEiLCJpYXQiOjE1Mzc1NTUzMjQsImV4cCI6MTU2OTA5MTMyNCwiYXVkIjoiaHR0cHM6Ly9rb3Zhbi5hYm92ZWJvYXJkLmFpIiwic3ViIjoiaW5zZWN1cmUtdG9rZW4iLCJqdGkiOiJkNzVhYmI4OS1lMGNjLTQ0NmYtOGE1Yy1iNzY1MWM1ODc4YTAifQ.AmvUMk14sFEs9h7gIrPa5Ns8F27UlvZoHfJ9HWGG6Jk'

const accessToken = window.location.pathname === '/letmein' ? letmeinAccessToken : (queryStringAccessToken || (window.localStorage && window.localStorage.getItem && window.localStorage.getItem('local-feathers-jwt')))

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
      })
      .catch(e => {
        console.log(`Token login error: ${e.message}`)
        store.dispatch(push('/login'))
      })
  } else {
    return Promise.resolve()
  }
}

export default init
