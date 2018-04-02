import { connect } from 'react-redux'
import LoginView from './LoginView'

const mapStateToProps = state => ({
  appType: state.config.appType,
})

const mapDispatchToProps = dispatch => {
  return {
    login: data => {
      dispatch({
        type: 'LOGIN',
        data,
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView)
