import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { each } from 'bluebird'
import { differenceBy, omit } from 'lodash'
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
    editInvestor: async newData => {
      try {
        const { value } = await loadInvestor(newData.id)
        const [originalData] = value.data
        const addedEthAddresses = differenceBy(newData.ethAddresses || [], originalData.ethAddresses || [], 'address')
        const removedEthAddresses = differenceBy(originalData.ethAddresses || [], newData.ethAddresses || [], 'address')

        await each(addedEthAddresses, ethAddress => {
          if (Array.isArray(ethAddress.whitelists)) {
            return each(ethAddress.whitelists, whitelist =>
              ethereum.addInvestorToWhitelist(
                ethAddress.address,
                whitelist.address,
                originalData.kycStatus,
                originalData.kycExpDate,
                originalData.accredStatus,
                originalData.jurisdiction))
          }
        })

        await each(removedEthAddresses, ethAddress => {
          if (Array.isArray(ethAddress.whitelists)) {
            return each(ethAddress.whitelists, whitelist =>
              ethereum.removeInvestorFromWhitelist(ethAddress.address, whitelist.address))
          }
        })

        await each(newData.ethAddresses, ethAddress => {
          const originalWhitelists = ethAddress.whitelists || []

          return each(originalData.ethAddresses, async originalEthAddress => {
            if (originalEthAddress.address === ethAddress.address) {
              const currentWhitelists = originalEthAddress.whitelists || []

              const addedWhitelists = differenceBy(originalWhitelists, currentWhitelists, 'address')
              const removedWhitelists = differenceBy(currentWhitelists, originalWhitelists, 'address')

              await each(addedWhitelists, whitelist =>
                ethereum.addInvestorToWhitelist(
                  ethAddress.address,
                  whitelist.address,
                  originalData.kycStatus,
                  originalData.kycExpDate,
                  originalData.accredStatus,
                  originalData.jurisdiction))
              await each(removedWhitelists, whitelist => ethereum.removeInvestorFromWhitelist(ethAddress.address, whitelist.address))
            }
          })
        })

        await dispatch(localServices.investor.patch(null, omit(newData, 'email'), { query: { id: newData.id } }))
        await dispatch(push('/owners'))
      } catch (e) {
        console.log(`Could not edit buyer ${e.message || e}`)
      }
    },
    routeTo: path => ownProps.history.push(path)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInvestorView)
