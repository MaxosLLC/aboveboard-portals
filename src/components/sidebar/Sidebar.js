import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import SidebarView from './SidebarView'

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    connected: state.wallet.connected,
    router: state.router,
    appType: state.config.appType,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    routeTo(path) {
      dispatch(push(path))
    },
  }
}

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(SidebarView)

export default Sidebar
