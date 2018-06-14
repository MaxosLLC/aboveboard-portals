export default (state = {
  current: ''
}, action) => {
  switch (action.type) {
    case 'SET_CURRENT_TOKEN':
      return Object.assign({}, state, { current: action.tokenAddress })
    default:
      return state
  }
}
