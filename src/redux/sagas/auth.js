import request from 'superagent'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import store from 'redux/store'
import { push } from 'react-router-redux'
import feathersCloudAuthentication from 'lib/feathers/cloud/feathersAuthentication'
import feathersLocalAuthentication from 'lib/feathers/local/feathersAuthentication'
import cloudServices from 'lib/feathers/cloud/feathersServices'
import localServices from 'lib/feathers/local/feathersServices'
import ethereum from 'lib/ethereum'

const appType = /issuer/.test(window.location.hostname) ? 'issuer' : 'broker'

const localApiUrl = appType === 'broker' ? process.env.REACT_APP_BROKER_LOCAL_API_URL || 'https://aboveboard-broker-api.herokuapp.com/'
  : process.env.REACT_APP_ISSUER_LOCAL_API_URL || 'https://aboveboard-issuer-api.herokuapp.com/'

const removeJwtFromLocalStorage = () => {
  if (window.localStorage && window.localStorage.removeItem) {
    window.localStorage.removeItem('feathers-jwt')
  }
}

const localAuthData = {
  strategy: 'local',
  email: 'local@local.com',
  password: 'local'
}

function * login (params) {
  const { email, password, rememberMe } = params.data

  const data = {
    strategy: 'local',
    email,
    password
  }

  try {
    const results = yield store.dispatch(feathersCloudAuthentication.authenticate(data))

    yield store.dispatch(feathersLocalAuthentication.authenticate(localAuthData))

    if (!rememberMe) {
      removeJwtFromLocalStorage()
    }

    yield put({
      type: 'LOGIN_SUCCESS',
      user: results.value.user,
      accessToken: results.value.accessToken
    })
  } catch (error) {
    yield put({
      type: 'LOGIN_ERROR',
      error
    })
  }
}

function * loginSuccess ({ user, accessToken }) {
  if (window.location.pathname === '/login') {
    yield put(push('/'))
  }

  yield ethereum.init({
    walletHost: user.walletHost,
    walletPort: user.walletPort,
    account: user.walletAccount,
    password: user.walletPassword
  })

  const [ethAddress] = yield ethereum.getAccounts()

  try {
    yield call(() => request
      .post(`${localApiUrl}initialize-local-api`)
      .send({ user, accessToken, ethAddress }))
  } catch (e) {
    console.error(`Could not initialize local API, error: ${e}`)
  }

  yield store.dispatch(feathersLocalAuthentication.authenticate(localAuthData))
  yield store.dispatch(cloudServices.token.find())
  yield store.dispatch(localServices.localToken.find())
  if (appType === 'broker') {
    yield store.dispatch(cloudServices.whitelist.find())
  }
}

function logout () {
  removeJwtFromLocalStorage()
  put(feathersCloudAuthentication.logout())

  window.location.replace('/')
}

export default function * watchAuth () {
  yield all([
    takeLatest('LOGIN', login),
    takeLatest('LOGIN_SUCCESS', loginSuccess),
    takeLatest('LOGOUT', logout)
  ])
}
