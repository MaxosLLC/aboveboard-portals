import { connect } from 'react-redux'
import MultisigWalletsView from './MultisigWalletsView'

const mapStateToProps = state => ({
  some: 'initialState',
  addresses: [] // TODO: get these from somewhere
})

const mapDispatchToProps = dispatch => {
  return {
    pushMe () {
      alert('hello Vojtech')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultisigWalletsView)
