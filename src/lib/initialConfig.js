const appType = process.env.REACT_APP_APP_TYPE || /issuer/.test(window.location.hostname) ? 'issuer' : 'broker'

module.exports = {
  init (store) {
    store.dispatch({ type: 'SET_APP_TYPE', appType })
  }
}
