import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import services from 'lib/feathers/local/feathersServices'
import InvestorsView from './InvestorsView'

const mapStateToProps = state => ({
  investors: state.investor.queryResult ? state.investor.queryResult.data : [],
  queryResult: state.investor.queryResult,
  loaded: state.investor.isFinished
})

const mapDispatchToProps = dispatch => {
  return {
    routeTo: path => dispatch(push(path)),
    loadInvestors: (page = 0) =>
      dispatch(services.investor.find({ query: { $skip: page * 25 } }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestorsView)
