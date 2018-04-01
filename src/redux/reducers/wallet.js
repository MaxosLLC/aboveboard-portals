import { walletConstants } from '../../constants'

const initialState = {
  showConnectionMessage: false
}

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
    case walletConstants.SHOW_CONNECTION_ALET:
      return {
        ...state,
        showConnectionAlert: action.payload
      }
    default:
      return state
  }
}
