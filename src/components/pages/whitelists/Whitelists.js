import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import localServices from 'lib/feathers/local/feathersServices'
import WhitelistsView from './WhitelistsView'

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  whitelists: state.whitelist.queryResult ? state.whitelist.queryResult.data : [],
  localTokens: state.localToken.queryResult ? state.localToken.queryResult.data : [],
  page: state.page.whitelists,
  search: state.search.whitelists,
  queryResult: { whitelists: state.whitelist.queryResult || { total: 0, limit: 0 } }
})

const mapDispatchToProps = dispatch => {
  return {
    routeTo (path) { dispatch(push(path)) },
    loadLocalTokens: () => dispatch(localServices.localToken.find()),
    loadWhitelists: () => dispatch(localServices.whitelist.find()),
    setPage: page => dispatch({ type: 'SET_PAGE', model: 'whitelists', page }),
    setSort: sort => dispatch({ type: 'SET_SORT', model: 'whitelists', sort }),
    setSearch: search => dispatch({ type: 'SET_SEARCH', model: 'whitelists', search })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WhitelistsView)
