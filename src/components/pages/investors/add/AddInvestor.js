import { mapSeries } from 'bluebird'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import services from 'lib/feathers/local/feathersServices'
import ethereum from 'lib/ethereum'
import AddInvestorView from './AddInvestorView'

const addInvestorToWhitelists = investor =>
  mapSeries(investor.ethAddresses || [], ethAddress => {
    return mapSeries(ethAddress.whitelists || [], whitelist => {
      return ethereum.addInvestorToWhitelist(
        ethAddress.address,
        whitelist.address
      )
    })
  })

const mapStateToProps = state => ({})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addInvestor: data => {
      const dataWithAddresses = data

      return addInvestorToWhitelists(dataWithAddresses)
        .then(() => dispatch(services.investor.create(dataWithAddresses)))
        .then(() => dispatch(push('/buyers')))
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddInvestorView)
