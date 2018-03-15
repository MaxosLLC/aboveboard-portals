export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_APP_TYPE':
      return Object.assign({}, state, { appType: action.appType })
    case 'SET_API_URL':
      return Object.assign({}, state, { apiUrl: action.apiUrl })
    default:
      return state
  }
}
