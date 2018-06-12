import { connect } from 'react-redux'
import localServices from 'lib/feathers/local/feathersServices'
import ShareholderDetailView from './ShareholderDetailView'

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  shareholder: state[state.currentUser.role === 'issuer' ? 'shareholder' : 'investor'].queryResult ? state[state.currentUser.role === 'issuer' ? 'shareholder' : 'investor'].queryResult.data[0] || {} : {},
  tokens: state.token.queryResult ? state.token.queryResult.data : [],
  loaded: state.token.isFinished && state[state.currentUser.role === 'issuer' ? 'shareholder' : 'investor'].isFinished
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadShareholder: currentUser => dispatch(localServices[currentUser.role === 'issuer' ? 'shareholder' : 'investor'].find({ query: { id: ownProps.match.params.id, $limit: 1 } }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareholderDetailView)
