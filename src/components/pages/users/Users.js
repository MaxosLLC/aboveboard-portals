import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import localServices from 'lib/feathers/local/feathersServices'
import UsersView from './UsersView'

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  users: state.user.queryResult ? state.user.queryResult.data : [],
  page: state.page.users,
  search: state.search.users,
  queryResult: {
    users: state.user.queryResult || { total: 0, limit: 0 }
  },
  loaded: state.user.isFinished && state.localToken.isFinished
})

const mapDispatchToProps = dispatch => {
  return {
    routeTo: path => dispatch(push(path)),
    loadUsers: () => dispatch(localServices.user.find()),
    removeUser: id => dispatch(localServices.user.remove(null, { query: { id } })),
    setPage: page => dispatch({ type: 'SET_PAGE', model: 'users', page }),
    setSort: sort => dispatch({ type: 'SET_SORT', model: 'users', sort }),
    setSearch: search => dispatch({ type: 'SET_SEARCH', model: 'users', search })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersView)
