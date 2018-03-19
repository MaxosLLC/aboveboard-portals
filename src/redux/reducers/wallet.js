export default (state = {}, action) => {
  switch (action.type) {
    case 'WALLET_CONNECT_SUCCESS':
      return Object.assign({}, state, { connected: true, error: null });
    case 'WALLET_CONNECT_ERROR':
      return Object.assign({}, state, {
        connected: false,
        error: action.error,
      });
    case 'WALLET_TRANSACTION_SUCCESS':
      return Object.assign({}, state, { error: null });
    case 'WALLET_TRANSACTION_ERROR':
      return Object.assign({}, state, { error: action.error });
    default:
      return state;
  }
};
