export default (state = {
  transactions: {}
}, action) => {
  switch (action.type) {
    case 'SET_TOTAL_TRANSACTIONS':
      return Object.assign({}, state, { transactions: { [action.contractAddress]: action.tokens } })
    default:
      return state
  }
}
