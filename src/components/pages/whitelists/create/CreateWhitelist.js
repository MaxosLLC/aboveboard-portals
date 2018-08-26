import { connect } from 'react-redux'

// import cloudServices from 'lib/feathers/cloud/feathersServices'
import CreateWhitelistView from './CreateWhitelistView'
import ethereum from 'lib/ethereum'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createWhitelist: async ({ name, type, tokens }) => {
      const address = await ethereum.deployContract('whitelist', type)

      console.log('address ', address)
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWhitelistView)
