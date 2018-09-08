import { connect } from 'react-redux'
import localServices from 'lib/feathers/local/feathersServices'
import { push } from 'react-router-redux'
import TokensView from './TokensView'

const mapStateToProps = state => ({
  localTokens: state.localToken.queryResult ? state.localToken.queryResult.data : [],
  loaded: state.localToken.isFinished
})

const mapDispatchToProps = dispatch => {
  return {
    routeTo: path => dispatch(push(path)),
    loadLocalTokens: () => dispatch(localServices.localToken.find())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokensView)
