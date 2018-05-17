import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { each } from 'bluebird'

import services from 'lib/feathers/local/feathersServices'
import InvestorsView from './InvestorsView'

const mapStateToProps = state => ({
  investors: state.investor.queryResult ? state.investor.queryResult.data : [],
  queryResult: state.investor.queryResult || { total: 0, limit: 0 },
  page: state.page,
  search: state.search,
  loaded: state.investor.isFinished
})

const mapDispatchToProps = dispatch => {
  return {
    routeTo: path => dispatch(push(path)),
    loadInvestors: (page = 0) =>
      dispatch(services.investor.find({ query: { $skip: page * 25 } })),
    setPage: page => dispatch({ type: 'SET_PAGE', model: 'investors', page }),
    setSort: sort => dispatch({ type: 'SET_SORT', model: 'investors', sort }),
    setSearch: search => dispatch({ type: 'SET_SEARCH', model: 'investors', search }),
    addInvestorsToWhitelists: (investors = [], whitelists) => 
      each(investors, investor => 
        each(whitelists, whitelist => ethereum.addInvestorsToWhitelist(
          investor.ethAddresses.map(i => i.address) ,whitelist.address
        ))
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestorsView)
