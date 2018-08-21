import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import SidebarView from './SidebarView'

import ethereum from 'lib/ethereum'

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    currentToken: state.tokens.current,
    connected: state.wallet.connected,
    router: state.router
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    routeTo (path) { dispatch(push(path)) },
    async testDeploy () {
      console.log('test start')
      const contractAddress = await ethereum.deployContract('settingsStorage')
      console.log('test doine ', contractAddress)
    }
  }
}

const Sidebar = connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarView)

export default Sidebar
