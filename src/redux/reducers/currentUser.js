export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return Object.assign({}, { isSaving: true })

    case 'LOGIN_SUCCESS':
      return Object.assign({}, action.user, { accessToken: action.accessToken })
    case 'SET_CURRENT_USER':
      return Object.assign({}, state, action.user)

    case 'CLOUD_API_CONNECTING':
      return Object.assign({}, state, { cloudAPIConnecting: true })
    case 'CLOUD_API_CONNECTED':
      return Object.assign({}, state, { cloudAPIConnected: true, cloudAPIConnecting: false })

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
