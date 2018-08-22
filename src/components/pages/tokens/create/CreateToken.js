import { connect } from 'react-redux'
import CreateTokenView from './CreateTokenView'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createToken: () => { console.log('todo') },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTokenView)
