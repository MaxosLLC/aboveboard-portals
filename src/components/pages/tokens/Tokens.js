import { connect } from 'react-redux'
import localServices from 'lib/feathers/local/feathersServices'
import { push } from 'react-router-redux'
import TokensView from './TokensView'

const mapStateToProps = state => ({
  whitelists: state.whitelist.queryResult ? state.whitelist.queryResult.data : [],
  localTokens: state.localToken.queryResult ? state.localToken.queryResult.data : []
})

const mapDispatchToProps = dispatch => {
  return {
    routeTo: path => dispatch(push(path)),
    loadWhitelists: () => dispatch(localServices.whitelist.find()),
    loadLocalTokens: () => dispatch(localServices.localToken.find())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TokensView)
