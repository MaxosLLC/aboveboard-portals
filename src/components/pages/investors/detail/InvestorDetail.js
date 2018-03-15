import { connect } from 'react-redux'
import localServices from 'lib/feathers/local/feathersServices'
import InvestorDetailView from './InvestorDetailView'

const mapStateToProps = state => ({
  investor: state.investor.queryResult ? state.investor.queryResult.data[0] : {},
  whitelists: state.whitelist.queryResult ? state.whitelist.queryResult.data : [],
  loaded: state.whitelist.isFinished && state.investor.isFinished
})

const mapDispatchToProps = dispatch => {
  return {
    loadInvestor: id => dispatch(localServices.investor.find({ query: { id, $limit: 1 } }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestorDetailView)
