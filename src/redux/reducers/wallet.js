import constants from 'app_constants'

const initialState = {
  showConnectionMessage: false
}

const walletConstants = constants.walletConstants

export default (state = initialState, action) => {
  switch (action.type) {
    case walletConstants.CONNECT_SUCCESS:
      return Object.assign({}, state, { connected: true, error: null })
    case walletConstants.CONNECT_ERROR:
      return Object.assign({}, state, { connected: false, error: action.error })
    case walletConstants.TRANSACTION_SUCCESS:
      return Object.assign({}, state, { error: null })
    case walletConstants.TRANSACTION_ERROR:
      return Object.assign({}, state, { error: action.error })
    case walletConstants.SHOW_CONNECTION_ALERT:
      return {
        ...state,
        showConnectionAlert: action.payload
      }
    default:
      return state
  }
}
