export default (state = {
  investors: 0,
  transactions: 0,
  pendingTransactions: 0
}, action) => {
  switch (action.type) {
    case 'SET_PAGE':
      return Object.assign({}, state, { [action.model]: action.page })
    default:
      return state
  }
}
