import { connect } from 'react-redux'

import localServices from 'lib/feathers/local/feathersServices'
import CreateUserView from './CreateUserView'

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createUser: async userData => {
      const emails = [userData.email]

      try {
        await dispatch(localServices.user.create({ emails, admin: userData.admin }))

        return ownProps.history.push('/users')
      } catch (e) {
        void e
      }
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserView)
