import { connect } from 'react-redux'
import localServices from 'lib/feathers/local/feathersServices'
import InvestorDetailView from './InvestorDetailView'

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  investor: state.investor.queryResult ? state.investor.queryResult.data[0] : {},
  whitelists: state.whitelist.queryResult ? state.whitelist.queryResult.data : [],
  loaded: state.whitelist.isFinished && state.investor.isFinished
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadInvestor: currentUser => {
      if (currentUser.role === 'buyer') {
        return dispatch(localServices.investor.find({ query: { email: currentUser.email, $limit: 1 } }))
      }

      return dispatch(localServices.investor.find({ query: { id: ownProps.match.params.id, $limit: 1 } }))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestorDetailView)
