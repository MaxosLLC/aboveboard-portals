export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return Object.assign({}, { isSaving: true })

    case 'LOGIN_SUCCESS':
    case 'SET_CURRENT_USER':
      return Object.assign({}, action.user)

    case 'SERVICES_USER_PATCH_FULFILLED':
      return Object.assign({}, state, action.payload)

    case 'LOGIN_ERROR':
      return { error: action.error.message }

    case 'LOGOUT':
      return {}

    case 'UPDATE':
      return {...state, updating: true}

    case 'UPDATE_FAILED':
      return {...state, updating: false}
    
    default:
      return state
  }
}
