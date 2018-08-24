export default (state = {
  investors: { lastName: -1 },
  transactions: { createdAt: -1 },
  pendingTransactions: { createdAt: -1 },
  whitelists: { createdAt: -1 },
  users: { createdAt: -1 }
}, action) => {
  switch (action.type) {
    case 'SET_SORT':
      return Object.assign({}, state, { [action.model]: action.sort })
    default:
      return state
  }
}
