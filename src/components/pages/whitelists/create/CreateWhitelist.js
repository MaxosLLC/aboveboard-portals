import { connect } from 'react-redux'
import CreateWhitelistView from './CreateWhitelistView'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createWhitelist: () => { console.log('todo') },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWhitelistView)
