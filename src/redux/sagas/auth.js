import { all, put, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import store from 'redux/store'
import feathersLocalAuthentication from 'lib/feathers/local/feathersAuthentication'
import cloudServices from 'lib/feathers/cloud/feathersServices'
import localServices from 'lib/feathers/local/feathersServices'
import ethereum from 'lib/ethereum'

const appType = /issuer/.test(window.location.hostname) ? 'issuer' : 'broker'

const removeJwtFromLocalStorage = () => {
  if (window.localStorage && window.localStorage.removeItem) {
    window.localStorage.removeItem('feathers-jwt');
  }
};

function * loginSuccess ({ user, accessToken }) {
  if (appType === 'issuer' && window.location.pathname === '/') {
    yield store.dispatch(push('/tokens'))
  }

  yield ethereum.init({
    walletHost: user.walletHost,
    walletPort: user.walletPort,
    account: user.walletAccount,
    password: user.walletPassword,
  });

  const [ethAddress] = yield ethereum.getAccounts();

  yield store.dispatch(localServices.user.patch(null, { ethAddresses: [ { address: ethAddress } ] }, { query: { email: 'local@local.com' } }))
  yield store.dispatch(cloudServices.token.find())
  yield store.dispatch(localServices.localToken.find())
  if (appType === 'broker') {
    yield store.dispatch(cloudServices.whitelist.find());
  }
}

function logout () {
  removeJwtFromLocalStorage()
  put(feathersLocalAuthentication.logout())

  window.location.replace('/');
}

export default function* watchAuth() {
  yield all([
    takeLatest('LOGIN_SUCCESS', loginSuccess),
    takeLatest('LOGOUT', logout),
  ]);
}
