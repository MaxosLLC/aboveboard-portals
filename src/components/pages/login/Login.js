import { connect } from 'react-redux'
import LoginView from './LoginView'

const mapStateToProps = state => ({
  loading: state.currentUser.cloudAPIConnecting,
  loaded: state.currentUser.cloudAPIConnected
})

export default connect(mapStateToProps)(LoginView)
