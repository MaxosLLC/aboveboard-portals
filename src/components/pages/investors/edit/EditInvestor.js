import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { each } from 'bluebird'
import { differenceBy } from 'lodash'
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
          const addedEthAddresses = differenceBy(newData.ethAddresses || [], originalData.ethAddresses || [], 'address')
          const removedEthAddresses = differenceBy(originalData.ethAddresses || [], newData.ethAddresses || [], 'address')

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
                const originalWhitelists = ethAddress.whitelists || []

                return each(originalData.ethAddresses, originalEthAddress => {
                  if (originalEthAddress === ethAddress) {
                    const currentWhitelists = originalEthAddress.whitelists || []

                    const addedWhitelists = differenceBy(originalWhitelists, currentWhitelists, 'address')
                    const removedWhitelists = differenceBy(currentWhitelists, originalWhitelists, 'address')

                    return each(addedWhitelists, whitelist => ethereum.addInvestorToWhitelist(ethAddress.address, whitelist.address))
                      .then(() => each(removedWhitelists, whitelist => ethereum.removeInvestorFromWhitelist(ethAddress.address, whitelist.address)))
                  }
                })
              })
            })
        })
        .then(() => dispatch(localServices.investor.patch(null, newData, { query: { id: newData.id } })))
        .then(() => dispatch(push('/buyers'))),
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInvestorView)
