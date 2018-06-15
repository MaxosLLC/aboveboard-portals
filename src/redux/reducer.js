import { combineReducers } from 'redux'
import cloudServices from 'lib/feathers/cloud/feathersServices'
import localServices from 'lib/feathers/local/feathersServices'
import feathersAuthentication from 'lib/feathers/cloud/feathersAuthentication'
import currentUser from './reducers/currentUser'
import config from './reducers/config'
import wallet from './reducers/wallet'
import page from './reducers/page'
import sort from './reducers/sort'
import search from './reducers/search'
import totals from './reducers/totals'
import tokens from './reducers/tokens'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'

const reducers = {
  auth: feathersAuthentication.reducer,
  currentUser,
  config,
  wallet,
  page,
  sort,
  search,
  totals,
  tokens,
  form: formReducer,
  user: cloudServices.user.reducer,
  token: cloudServices.token.reducer,
  localToken: localServices.localToken.reducer,
  router: routerReducer
}

if (cloudServices.whitelist) {
  reducers.whitelist = cloudServices.whitelist.reducer
}

if (localServices.investor) {
  reducers.investor = localServices.investor.reducer
}

if (localServices.shareholder) {
  reducers.shareholder = localServices.shareholder.reducer
}

if (localServices.transaction) {
  reducers.transaction = localServices.transaction.reducer
}

export default combineReducers(reducers)
