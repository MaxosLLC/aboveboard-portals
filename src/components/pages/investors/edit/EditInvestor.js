import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { each } from 'bluebird'
import { difference } from 'lodash'
import localServices from 'lib/feathers/local/feathersServices'
import ethereum from 'lib/ethereum'

import EditInvestorView from './EditInvestorView'

const mapStateToProps = state => ({
  investor: state.investor.queryResult ? state.investor.queryResult.data[0] : {},
  whitelists: state.whitelist.queryResult ? state.whitelist.queryResult.data : [],
  loaded: state.whitelist.isFinished && state.investor.isFinished
})

const mapDispatchToProps = (dispatch, ownProps) => {
  const loadInvestor = id => dispatch(localServices.investor.find({ query: { id, $limit: 1 } }))
  return {
    loadInvestor,
    editInvestor: newData =>
      loadInvestor(newData.id)
        .then(({ value }) => {
          const [originalData] = value.data
          const addedEthAddresses = difference(newData.ethAddresses || [], originalData.ethAddresses || [])
          const removedEthAddresses = difference(originalData.ethAddresses || [], newData.ethAddresses || [])

          return each(addedEthAddresses, ethAddress => {
            if (Array.isArray(ethAddress.whitelists)) {
              return each(ethAddress.whitelists, whitelist =>
                ethereum.addInvestorToWhitelist(ethAddress.address, whitelist.address))
            }
          })
            .then(() => {
              return each(removedEthAddresses, ethAddress => {
                if (Array.isArray(ethAddress.whitelists)) {
                  return each(ethAddress.whitelists, whitelist =>
                    ethereum.removeInvestorFromWhitelist(ethAddress.address, whitelist.address))
                }
              })
            })
            .then(() => {
              return each(newData.ethAddresses, ethAddress => {
                const originalIssues = ethAddress.whitelists || []
                const currentIssues = ethAddress.whitelists || []

                const addedWhitelists = difference(originalIssues, currentIssues)
                const removedWhitelists = difference(currentIssues, originalIssues)

                return each(addedWhitelists, whitelist => ethereum.addInvestorToWhitelist(ethAddress.address, whitelist.address))
                  .then(() => each(removedWhitelists, whitelist => ethereum.removeInvestorFromWhitelist(ethAddress.address, whitelist.address)))
              })
            })
        })
        .then(() => dispatch(localServices.investor.patch(null, newData, { query: { id: newData.id } })))
        .then(() => dispatch(push('/buyers'))),
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInvestorView)
