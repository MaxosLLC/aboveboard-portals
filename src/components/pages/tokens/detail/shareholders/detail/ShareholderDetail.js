import { connect } from 'react-redux'
import localServices from 'lib/feathers/local/feathersServices'
import ShareholderDetailView from './ShareholderDetailView'

const mapStateToProps = state => ({
  shareholder: state.shareholder.queryResult
    ? state.shareholder.queryResult.data[0] || {}
    : {},
  tokens: state.token.queryResult ? state.token.queryResult.data : [],
  loaded: state.token.isFinished && state.shareholder.isFinished
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadShareholder: () =>
      dispatch(
        localServices.shareholder.find({
          query: { id: ownProps.match.params.id, $limit: 1 }
        })
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ShareholderDetailView
)
