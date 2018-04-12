import { appType } from 'lib/util'

export default {
  init (store) {
    store.dispatch({ type: 'SET_APP_TYPE', appType })
  }
}
