export default (state = {
  transactions: {},
}, action) => {
  switch (action.type) {
    case 'SET_TOTAL_TRANSACTIONS':
      return Object.assign({}, state, { transactions: { [action.contractAddress]: action.tokens } })
    case 'INCREMENT_TOTAL_TRANSACTIONS':
      return Object.assign({}, state, { transactions: { [action.contractAddress]: state.transactions[action.contractAddress] + 1 } })
    default:
      return state
  }
}
