import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import localServices from 'lib/feathers/local/feathersServices'

import EditInvestorView from './EditInvestorView'

const mapStateToProps = state => ({
  investor: state.investor.queryResult ? state.investor.queryResult.data[0] : {},
  whitelists: state.whitelist.queryResult ? state.whitelist.queryResult.data : [],
  loaded: state.whitelist.isFinished && state.investor.isFinished
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadInvestor: id => dispatch(localServices.investor.find({ query: { id, $limit: 1 } })),

    editInvestor: data => {

      const dataWithAddresses = Object.assign({}, data, data.ethAddresses)

      return dispatch(localServices.investor.patch(ownProps.match.params.id, dataWithAddresses))
        .then(() => dispatch(push('/buyers')))
    },
    routeTo: path => ownProps.history.push(path),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInvestorView)
