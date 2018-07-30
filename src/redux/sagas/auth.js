import { all, put, takeLatest } from 'redux-saga/effects'
import store from 'redux/store'
import { push } from 'react-router-redux'
import feathersCloudAuthentication from 'lib/feathers/cloud/feathersAuthentication'
import feathersLocalAuthentication from 'lib/feathers/local/feathersAuthentication'
import cloudServices from 'lib/feathers/cloud/feathersServices'
import localServices from 'lib/feathers/local/feathersServices'
import ethereum from 'lib/ethereum'

const removeJwtFromLocalStorage = () => {
  if (window.localStorage && window.localStorage.removeItem) {
    window.localStorage.removeItem('cloud-feathers-jwt')
    window.localStorage.removeItem('local-feathers-jwt')
  }
}

const publicCloudAPIAuthData = {
  strategy: 'local',
  email: 'public@aboveboard.com',
  password: 'Public12'
}

function * login (params) {
  const { email, password, rememberMe } = params.data

  const data = {
    strategy: 'local',
    email,
    password
  }

  try {
    const results = yield store.dispatch(feathersLocalAuthentication.authenticate(data))

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

const loginPathRegexp = /\/(token-)?login/
function * loginSuccess ({ user, accessToken }) {
  yield store.dispatch(feathersCloudAuthentication.authenticate(publicCloudAPIAuthData))

  if (loginPathRegexp.test(window.location.pathname)) {
    yield put(push('/'))
  }

  yield store.dispatch(cloudServices.token.find())
  const { value: { data: localTokens, total } } = yield store.dispatch(localServices.localToken.find())
  if (total === 1) {
    const tokenAddress = localTokens[0].address
    yield put({ type: 'SET_CURRENT_TOKEN', tokenAddress })
  }

  yield ethereum.init({
    walletHost: user.walletHost,
    walletPort: user.walletPort,
    account: user.walletAccount,
    password: user.walletPassword
  })
    .catch(e => console.log(`could not init ethereum, ${e.message}`))

  const accounts = yield ethereum.getAccounts()
  const ethAddresses = accounts.map(address => ({ address }))
  if (user.role !== 'buyer') {
    yield store.dispatch(localServices.user.patch(null, { ethAddresses }, { query: { id: user.id } }))
  }

  if (user.role === 'broker' || user.role === 'direct') {
    const whitelists = yield ethereum.getWhitelistsForBroker(user, localTokens)

    yield store.dispatch(cloudServices.whitelist.find({ query: { address: { $in: whitelists } } }))
  }
}

function logout () {
  removeJwtFromLocalStorage()
  put(feathersLocalAuthentication.logout())

  window.location.replace('/login')
}

export default function * watchAuth () {
  yield all([
    takeLatest('LOGIN', login),
    takeLatest('LOGIN_SUCCESS', loginSuccess),
    takeLatest('LOGOUT', logout)
  ])
}
