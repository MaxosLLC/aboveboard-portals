export default (state = {
  investors: '',
  transactions: '',
  pendingTransactions: '',
  whitelists: ''
}, action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return Object.assign({}, state, { [action.model]: action.search })
    default:
      return state
  }
}
