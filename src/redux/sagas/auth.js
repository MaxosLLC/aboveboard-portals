import { all, put, takeLatest } from 'redux-saga/effects'
import store from 'redux/store'
import { push } from 'react-router-redux'
import feathersLocalAuthentication from 'lib/feathers/local/feathersAuthentication'
import cloudServices from 'lib/feathers/cloud/feathersServices'
import localServices from 'lib/feathers/local/feathersServices'
import ethereum from 'lib/ethereum'
import { appType } from 'lib/util'

const removeJwtFromLocalStorage = () => {
  if (window.localStorage && window.localStorage.removeItem) {
    window.localStorage.removeItem('feathers-jwt')
  }
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

  yield store.dispatch(localServices.user.patch(null, { ethAddresses: [ { address: ethAddress } ] }, { query: { email: user.email } }))
  yield store.dispatch(cloudServices.token.find())
  yield store.dispatch(localServices.localToken.find())
  if (appType === 'broker') {
    yield store.dispatch(cloudServices.whitelist.find())
  }
}

function logout () {
  removeJwtFromLocalStorage()
  put(feathersLocalAuthentication.logout())

  window.location.replace('/')
}

export default function * watchAuth () {
  yield all([
    takeLatest('LOGIN', login),
    takeLatest('LOGIN_SUCCESS', loginSuccess),
    takeLatest('LOGOUT', logout)
  ])
}
