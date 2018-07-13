export default (state = {
  shareholders: {},
  transactions: {}
}, action) => {
  switch (action.type) {
    case 'SET_TOTAL_TRANSACTIONS':
      return Object.assign({}, state, { transactions: { [action.contractAddress]: action.tokens } })
    case 'SET_TOTAL_SHAREHOLDERS':
      return Object.assign({}, state, { shareholders: { [action.contractAddress]: action.shareholders } })
    default:
      return state
  }
}
