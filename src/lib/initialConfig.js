import { appType } from 'lib/util'

module.exports = {
  init (store) {
    store.dispatch({ type: 'SET_APP_TYPE', appType })
  }
}
