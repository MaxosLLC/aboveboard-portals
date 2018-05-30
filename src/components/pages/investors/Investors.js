import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { each } from 'bluebird'

import services from 'lib/feathers/local/feathersServices'
import ethereum from 'lib/ethereum'
import InvestorsView from './InvestorsView'

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  investors: state.investor.queryResult ? state.investor.queryResult.data : [],
  queryResult: state.investor.queryResult || { total: 0, limit: 0 },
  page: state.page,
  search: state.search,
  loaded: state.investor.isFinished,
  whitelists: state.whitelist.queryResult ? state.whitelist.queryResult.data : []
})

const mapDispatchToProps = dispatch => {
  const model = 'investors'

  return {
    routeTo: path => dispatch(push(path)),
    loadInvestors: () => dispatch(services.investor.find({ query: { $skip: 0 } })),
    setPage: page => dispatch({ type: 'SET_PAGE', model, page }),
    setSort: sort => dispatch({ type: 'SET_SORT', model, sort }),
    setSearch: search => dispatch({ type: 'SET_SEARCH', model, search }),
    addInvestorsToWhitelists: (investors = [], whitelists = []) => Promise.all([
      each(investors, investor => services.investor.create(investor)), // Create in local database
      each(investors, investor => // Call to eth contracts
        each(whitelists, whitelist => ethereum.addInvestorsToWhitelist(
          investor.ethAddresses.map(i => i.address), whitelist.address
        ))
      )
    ])
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestorsView)
