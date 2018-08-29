import { each } from 'bluebird'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import services from 'lib/feathers/local/feathersServices'
import ethereum from 'lib/ethereum'
import AddInvestorView from './AddInvestorView'

const addInvestorToWhitelists = investor =>
  each(investor.ethAddresses || [], ethAddress => {
    return each(ethAddress.whitelists || [], whitelist => {
      return ethereum.addInvestorToWhitelist(
        ethAddress.address,
        whitelist.address,
        investor.kycStatus, investor.kycExpDate, investor.accredStatus, investor.jurisdiction
      )
    })
  })

const mapStateToProps = state => ({
  connected: state.wallet.connected
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addInvestor: data => {
      const dataWithAddresses = data

      return addInvestorToWhitelists(dataWithAddresses)
        .then(() => dispatch(services.investor.create(dataWithAddresses)))
        .then(() => dispatch(push('/whitelisting')))
        .catch(e => console.error(`Unable to create buyer, error ${e}`))
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddInvestorView)
