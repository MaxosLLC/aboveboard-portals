import { connect } from 'react-redux'
import CreateTokenView from './CreateTokenView'
import ethereum from 'lib/ethereum'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createToken: async ({ name, type, tokens }) => {
      const address = await ethereum.deployNewToken()

      console.log('address ', address)
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTokenView)
