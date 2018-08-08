export default (state = {}, action) => {
  switch (action.type) {
    case 'WALLET_CONNECT_SUCCESS':
      return Object.assign({}, state, { connected: true, error: null })
    case 'WALLET_CONNECT_ERROR':
      return Object.assign({}, state, { connected: false, error: action.error })
    case 'WALLET_TRANSACTION_START':
      return Object.assign({}, state, { method: action.method, processing: true })
    case 'WALLET_TRANSACTION_SUCCESS':
      return Object.assign({}, state, { error: null, processing: false })
    case 'WALLET_TRANSACTION_ERROR':
      return Object.assign({}, state, { error: action.error, processing: false })
    case 'WALLET_UPDATE_CURRENT_ACCOUNT':
      return Object.assign({}, state, { address: action.address })
    default:
      return state
  }
}
